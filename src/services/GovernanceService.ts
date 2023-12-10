import {
  DEFAULT_NULL_VALUE_ON_TX,
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  gasLimitRecommendations,
  GasResponse,
  GovDelegate,
  GovDelegateTokensBySig,
  GovPrepareDelegateSig,
  ProtocolAction,
  TransactionGenerationMethod,
  transactionType,
} from '@aave/contract-helpers';
import { estimateGasByNetwork } from '@aave/contract-helpers/dist/cjs/commons/gasStation';
import { normalize, valueToBigNumber } from '@aave/math-utils';
import { Provider } from '@ethersproject/providers';
import { BigNumber, PopulatedTransaction } from 'ethers';
import {
  EscrowSEAM,
  EscrowSEAM__factory,
  Multicall,
  Multicall__factory,
  SEAM,
  SEAM__factory,
  SeamGovernor,
  SeamGovernor__factory,
} from 'src/services/types';
import { Multicall3 } from 'src/services/types/Multicall';
import { governanceConfig } from 'src/ui-config/governanceConfig';
import { Hashable } from 'src/utils/types';

interface Powers {
  votingPower: string;
  seamTokenPower: string;
  esSEAMTokenPower: string;
  seamVotingDelegatee: string;
  esSEAMVotingDelegatee: string;
}

export enum Support {
  Against,
  For,
  Abstain,
}

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

export class GovernanceService implements Hashable {
  readonly provider: Provider;
  readonly multicall: Multicall;
  readonly seam: SEAM;
  readonly esSEAM: EscrowSEAM;
  readonly governorLong: SeamGovernor;
  readonly governorShort: SeamGovernor;

  constructor(provider: Provider, public readonly chainId: number) {
    this.provider = provider;
    this.multicall = Multicall__factory.connect(
      governanceConfig.addresses.MULTICALL_ADDRESS,
      this.provider
    );
    this.seam = SEAM__factory.connect(governanceConfig.seamTokenAddress, this.provider);
    this.esSEAM = EscrowSEAM__factory.connect(governanceConfig.esSEAMTokenAddress, this.provider);
    this.governorLong = SeamGovernor__factory.connect(
      governanceConfig.addresses.GOVERNOR_LONG_ADDRESS,
      this.provider
    );
    this.governorShort = SeamGovernor__factory.connect(
      governanceConfig.addresses.GOVERNOR_SHORT_ADDRESS,
      this.provider
    );
  }
  async getHasVotedOnProposal(
    governorAddress: string,
    proposalId: string,
    user: string
  ): Promise<boolean> {
    const governor =
      governorAddress.toLocaleLowerCase() === this.governorShort.address.toLocaleLowerCase()
        ? this.governorShort
        : this.governorLong;

    return governor.hasVoted(proposalId, user);
  }
  async getProposalState(governorAddress: string, proposalId: string): Promise<ProposalState> {
    const governor =
      governorAddress.toLocaleLowerCase() === this.governorShort.address.toLocaleLowerCase()
        ? this.governorShort
        : this.governorLong;

    return governor.state(proposalId);
  }
  async castVote(governorAddress: string, proposalId: string, user: string, support: Support) {
    const governor =
      governorAddress.toLocaleLowerCase() === this.governorShort.address.toLocaleLowerCase()
        ? this.governorShort
        : this.governorLong;

    const txs: EthereumTransactionTypeExtended[] = [];

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () => governor.populateTransaction.castVote(proposalId, support),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOVERNANCE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }
  async getVestedEsSEAM(user: string): Promise<string> {
    const amount = await this.esSEAM.getClaimableAmount(user);
    return normalize(valueToBigNumber(amount.toString()), 18);
  }
  async getPowers(user: string): Promise<Powers> {
    const getDelegatesAndSelfCalls: Multicall3.CallStruct[] = [
      {
        target: this.seam.address,
        callData: this.seam.interface.encodeFunctionData('getVotes', [user]),
      },
      {
        target: this.seam.address,
        callData: this.seam.interface.encodeFunctionData('delegates', [user]),
      },
      {
        target: this.esSEAM.address,
        callData: this.esSEAM.interface.encodeFunctionData('getVotes', [user]),
      },
      {
        target: this.esSEAM.address,
        callData: this.esSEAM.interface.encodeFunctionData('delegates', [user]),
      },
    ];

    const { returnData: getDelegatesAndSelfCallsReturnData } =
      await this.multicall.callStatic.aggregate(getDelegatesAndSelfCalls);

    const seamTokenPower: BigNumber = this.seam.interface.decodeFunctionResult(
      'getVotes',
      getDelegatesAndSelfCallsReturnData[0]
    )[0];
    const seamDelegatee: string = this.seam.interface.decodeFunctionResult(
      'delegates',
      getDelegatesAndSelfCallsReturnData[1]
    )[0];
    const esSEAMTokenPower: BigNumber = this.seam.interface.decodeFunctionResult(
      'getVotes',
      getDelegatesAndSelfCallsReturnData[2]
    )[0];
    const esSEAMDelegatee: string = this.seam.interface.decodeFunctionResult(
      'delegates',
      getDelegatesAndSelfCallsReturnData[3]
    )[0];

    const powers = {
      votingPower: normalize(
        valueToBigNumber(seamTokenPower.toString()).plus(esSEAMTokenPower.toString()).toString(),
        18
      ),
      seamTokenPower: normalize(valueToBigNumber(seamTokenPower.toString()), 18),
      esSEAMTokenPower: normalize(valueToBigNumber(esSEAMTokenPower.toString()), 18),
      seamVotingDelegatee: seamDelegatee,
      esSEAMVotingDelegatee: esSEAMDelegatee,
    };
    return powers;
  }
  async prepareDelegateSignature({
    delegatee,
    governanceToken,
    nonce,
    expiry,
  }: GovPrepareDelegateSig) {
    const delegateeAddress: string = await this.getDelegateeAddress(delegatee);

    const governanceDelegationToken =
      governanceToken.toLocaleLowerCase() === this.seam.address.toLocaleLowerCase()
        ? this.seam
        : this.esSEAM;

    const [, name, version, chainId, verifyingContract, ,] =
      await governanceDelegationToken.eip712Domain();

    const typeData = {
      primaryType: 'Delegation',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Delegation: [
          { name: 'delegatee', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'expiry', type: 'uint256' },
        ],
      },
      domain: {
        name: name,
        version: version,
        chainId: chainId.toNumber(),
        verifyingContract: verifyingContract,
      },
      message: {
        delegatee: delegateeAddress,
        nonce,
        expiry,
      },
    };

    return JSON.stringify(typeData);
  }
  async delegateTokensBySig({ user, tokens, data }: GovDelegateTokensBySig) {
    const calls: Multicall3.CallStruct[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].toLocaleLowerCase();
      const { delegatee, nonce, expiry, v, r, s } = data[i];
      if (token === this.seam.address.toLocaleLowerCase()) {
        calls.push({
          target: this.seam.address,
          callData: this.seam.interface.encodeFunctionData('delegateBySig', [
            delegatee,
            nonce,
            expiry,
            v,
            r,
            s,
          ]),
        });
      } else if (token === this.esSEAM.address.toLocaleLowerCase()) {
        calls.push({
          target: this.esSEAM.address,
          callData: this.esSEAM.interface.encodeFunctionData('delegateBySig', [
            delegatee,
            nonce,
            expiry,
            v,
            r,
            s,
          ]),
        });
      }
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () => this.multicall.populateTransaction.aggregate(calls),
      from: user,
    });
    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.GOV_DELEGATION_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }
  async claimVestedEsSEAM(user: string) {
    const txs: EthereumTransactionTypeExtended[] = [];
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () => this.esSEAM.populateTransaction.claim(user),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: 'CLAIM_VESTED_ESSEAM' as eEthereumTxType,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }
  async delegate({ user, delegatee, governanceToken }: GovDelegate) {
    const txs: EthereumTransactionTypeExtended[] = [];
    const governanceDelegationToken =
      governanceToken.toLocaleLowerCase() === this.seam.address.toLocaleLowerCase()
        ? this.seam
        : this.esSEAM;

    const delegateeAddress: string = await this.getDelegateeAddress(delegatee);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        governanceDelegationToken.populateTransaction.delegate(delegateeAddress),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.GOV_DELEGATION_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }
  async getDelegateeAddress(delegatee: string): Promise<string> {
    if (canBeEnsAddress(delegatee)) {
      const delegateeAddress = await this.provider.resolveName(delegatee);
      if (!delegateeAddress) throw new Error(`Address: ${delegatee} is not a valid ENS address`);

      return delegateeAddress;
    }

    return delegatee;
  }
  readonly generateTxCallback =
    ({
      rawTxMethod,
      from,
      value,
      gasSurplus,
      action,
    }: TransactionGenerationMethod): (() => Promise<transactionType>) =>
    async () => {
      const txRaw: PopulatedTransaction = await rawTxMethod();

      const tx: transactionType = {
        ...txRaw,
        from,
        value: value ?? DEFAULT_NULL_VALUE_ON_TX,
      };

      tx.gasLimit = await estimateGasByNetwork(tx, this.provider, gasSurplus);

      if (
        action &&
        gasLimitRecommendations[action] &&
        tx.gasLimit.lte(BigNumber.from(gasLimitRecommendations[action].limit))
      ) {
        tx.gasLimit = BigNumber.from(gasLimitRecommendations[action].recommended);
      }

      return tx;
    };
  readonly generateTxPriceEstimation =
    (
      txs: EthereumTransactionTypeExtended[],
      txCallback: () => Promise<transactionType>,
      action: string = ProtocolAction.default
    ): GasResponse =>
    async (force = false) => {
      const gasPrice = await this.provider.getGasPrice();
      const hasPendingApprovals = txs.find((tx) => tx.txType === eEthereumTxType.ERC20_APPROVAL);
      if (!hasPendingApprovals || force) {
        const { gasLimit, gasPrice: gasPriceProv }: transactionType = await txCallback();
        if (!gasLimit) {
          // If we don't receive the correct gas we throw an error
          throw new Error('Transaction calculation error');
        }

        return {
          gasLimit: gasLimit.toString(),
          gasPrice: gasPriceProv ? gasPriceProv.toString() : gasPrice.toString(),
        };
      }

      return {
        gasLimit: gasLimitRecommendations[action].recommended,
        gasPrice: gasPrice.toString(),
      };
    };
  public toHash() {
    return this.chainId.toString();
  }
}

export const canBeEnsAddress = (ensAddress: string): boolean => {
  return ensAddress.toLowerCase().endsWith('.eth');
};
