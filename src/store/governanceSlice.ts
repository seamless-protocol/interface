import {
  ERC20_2612Service,
  EthereumTransactionTypeExtended,
  GovDelegate,
  GovDelegateTokensBySig,
  GovPrepareDelegateSig,
} from '@aave/contract-helpers';
import { GovernanceService } from 'src/services/GovernanceService';
import { governanceConfig } from 'src/ui-config/governanceConfig';
import { getProvider } from 'src/utils/marketsAndNetworksConfig';
import { StateCreator } from 'zustand';

import { RootStore } from './root';

export interface GovernanceSlice {
  delegate: (args: Omit<GovDelegate, 'user'>) => Promise<EthereumTransactionTypeExtended[]>;
  prepareDelegateSignature: (args: GovPrepareDelegateSig) => Promise<string>;
  submitVote: () => void;
  getTokenNonce: (user: string, token: string) => Promise<number>;
  delegateTokensBySig: (args: GovDelegateTokensBySig) => Promise<EthereumTransactionTypeExtended[]>;
  claimVestedEsSEAM: (user: string) => Promise<EthereumTransactionTypeExtended[]>;
}

export const createGovernanceSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  GovernanceSlice
> = (_, get) => {
  function getChainId() {
    const currentNetworkConfig = get().currentNetworkConfig;
    const isStakeFork =
      currentNetworkConfig.isFork &&
      currentNetworkConfig.underlyingChainId === governanceConfig?.chainId;
    return isStakeFork ? get().currentChainId : governanceConfig.chainId;
  }
  function getCorrectProvider() {
    const currentNetworkConfig = get().currentNetworkConfig;
    const isStakeFork =
      currentNetworkConfig.isFork &&
      currentNetworkConfig.underlyingChainId === governanceConfig?.chainId;
    return isStakeFork ? get().jsonRpcProvider() : getProvider(governanceConfig.chainId);
  }
  return {
    prepareDelegateSignature: (args) => {
      const service = new GovernanceService(getCorrectProvider(), getChainId());
      return service.prepareDelegateSignature(args);
    },
    delegate: (args) => {
      const governanceService = new GovernanceService(getCorrectProvider(), getChainId());
      const user = get().account;
      return governanceService.delegate({ ...args, user });
    },
    submitVote: (/*args: any*/) => {
      console.error('submitVote not implemented');
      throw new Error('not implemented');
    },
    getTokenNonce: async (user: string, token: string) => {
      const service = new ERC20_2612Service(getCorrectProvider());
      const nonce = await service.getNonce({ token, owner: user });
      return nonce || 0;
    },
    delegateTokensBySig: async (args) => {
      const governanceService = new GovernanceService(getCorrectProvider(), getChainId());
      return governanceService.delegateTokensBySig(args);
    },
    claimVestedEsSEAM: (user: string) => {
      const governanceService = new GovernanceService(getCorrectProvider(), getChainId());
      return governanceService.claimVestedEsSEAM(user);
    },
  };
};
