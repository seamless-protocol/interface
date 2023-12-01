import { GovGetVoteOnProposal, Power, tEthereumAddress } from '@aave/contract-helpers';
import { normalize, valueToBigNumber } from '@aave/math-utils';
import { Provider } from '@ethersproject/providers';
import { governanceConfig } from 'src/ui-config/governanceConfig';
import { Hashable } from 'src/utils/types';
import {
  IERC5805,
  IERC5805__factory,
  Multicall,
  Multicall__factory,
  IGovernor,
  IGovernor__factory,
  IEscrowSeam,
  IEscrowSeam__factory,
} from 'src/services/types';
import { Multicall3 } from 'src/services/types/Multicall';
import { BigNumber } from 'ethers';

interface Powers {
  votingPower: string;
  seamVotingDelegatee: string;
  esSEAMVotingDelegatee: string;
}

interface VoteOnProposalData {
  votingPower: string;
  support: boolean;
}

const checkIfDelegateeIsUser = (delegatee: tEthereumAddress, userAddress: tEthereumAddress) =>
  delegatee.toLocaleLowerCase() === userAddress.toLocaleLowerCase() ? '' : delegatee;

export class GovernanceService implements Hashable {
  readonly provider: Provider;
  readonly multicall: Multicall;
  readonly governor: IGovernor;
  readonly seam: IERC5805;
  readonly esSEAM: IEscrowSeam;

  constructor(provider: Provider, public readonly chainId: number) {
    this.provider = provider;
    this.multicall = Multicall__factory.connect(
      governanceConfig.addresses.MULTICALL_ADDRESS,
      this.provider
    );
    this.governor = IGovernor__factory.connect(
      governanceConfig.addresses.GOVERNOR_SHORT,
      this.provider
    );
    this.seam = IERC5805__factory.connect(governanceConfig.seamTokenAddress, this.provider);
    this.esSEAM = IEscrowSeam__factory.connect(governanceConfig.esSEAMTokenAddress, this.provider);
  }

  async getVotingPowerAt(account: string, timestamp: number) {
    console.log('getVotingPowerAt!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    return this.governor.getVotes(account, timestamp);
  }
  async getVoteOnProposal(request: GovGetVoteOnProposal): Promise<VoteOnProposalData> {
    console.error('Cannot obtain past vote value'); // TODO
    throw new Error('getVoteOnProposal: not implemented');
  }
  async getVestedSeamBalance(user: string): Promise<BigNumber> {
    console.log('bravoooo');
    return await this.esSEAM.getClaimableAmount(user);
  }
  async getPowers(user: string): Promise<Powers> {
    console.log('Uso u powers');
    const calls: Multicall3.CallStruct[] = [
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

    const { returnData } = await this.multicall.callStatic.aggregate(calls);

    console.log('getPowers - returnData: ', returnData);

    const seamTokenPower: BigNumber = this.seam.interface.decodeFunctionResult(
      'getVotes',
      returnData[0]
    )[0];
    const seamDelegatee: string = this.seam.interface.decodeFunctionResult(
      'delegates',
      returnData[1]
    )[0];
    const esSEAMTokenPower: BigNumber = this.seam.interface.decodeFunctionResult(
      'getVotes',
      returnData[2]
    )[0];
    const esSEAMDelegatee: string = this.seam.interface.decodeFunctionResult(
      'delegates',
      returnData[3]
    )[0];

    return {
      votingPower: '1000',
      seamVotingDelegatee: '',
      esSEAMVotingDelegatee: '',
    };

    const powers = {
      votingPower: normalize(
        valueToBigNumber(seamTokenPower.toString()).plus(esSEAMTokenPower.toString()).toString(),
        18
      ),
      seamTokenPower,
      esSEAMTokenPower,
      seamVotingDelegatee: checkIfDelegateeIsUser(seamDelegatee, user),
      esSEAMVotingDelegatee: checkIfDelegateeIsUser(esSEAMDelegatee, user),
    };
    return powers;
  }
  public toHash() {
    return this.chainId.toString();
  }
}
