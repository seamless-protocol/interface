import { ChainId } from '@aave/contract-helpers';

export interface GovernanceConfig {
  chainId: ChainId;
  walletBalanceProvider: string;
  votingAssetName: string;
  seamTokenAddress: string;
  esSEAMTokenAddress: string;
  governanceForumLink: string;
  governanceSnapshotLink: string;
  governanceTallyLink: string;
  governanceFAQLink: string;
  addresses: {
    GOVERNOR_SHORT_ADDRESS: string;
    GOVERNOR_LONG_ADDRESS: string;
    MULTICALL_ADDRESS: string;
  };
}

export const governanceConfig: GovernanceConfig = {
  chainId: ChainId.base,
  votingAssetName: 'SEAM + esSEAM',
  seamTokenAddress: '0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85',
  esSEAMTokenAddress: '0x998e44232BEF4F8B033e5A5175BDC97F2B10d5e5',
  governanceForumLink: 'https://seamlessprotocol.discourse.group',
  governanceFAQLink: 'https://docs.seamlessprotocol.com/governance/governance-overview',
  governanceTallyLink: 'https://www.tally.xyz/gov/seamless-protocol',
  walletBalanceProvider: '0xDb0f02421f830398d7b59dae8d385e2Cd5ed5CF7',
  governanceSnapshotLink: 'https://snapshot.org/#/seamlessprotocol.eth',
  addresses: {
    GOVERNOR_SHORT_ADDRESS: '0x8768c789C6df8AF1a92d96dE823b4F80010Db294',
    GOVERNOR_LONG_ADDRESS: '0x04faA2826DbB38a7A4E9a5E3dB26b9E389E761B6',
    MULTICALL_ADDRESS: '0xca11bde05977b3631167028862be2a173976ca11',
  },
};
