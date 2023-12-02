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
    GOVERNOR_SHORT: string;
    GOVERNOR_LONG: string;
    MULTICALL_ADDRESS: string;
  };
  ipfsGateway: string;
  fallbackIpfsGateway: string;
}

export const governanceConfig: GovernanceConfig = {
  chainId: 84531 as ChainId, // TODO(wes)
  votingAssetName: 'SEAM + esSEAM',
  seamTokenAddress: '0x8c0dE778f20e7D25E6E2AAc23d5Bee1d19Deb491', //mainnet: '0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85',
  esSEAMTokenAddress: '0x6B3D691C6E826f10f17e0be1cCf9694b6B22136E', // TODO(wes) mainnet
  governanceForumLink: 'https://seamlessprotocol.discourse.group',
  governanceFAQLink: '', // TODO(wes): TBD
  governanceTallyLink: '', // TODO(wes)
  walletBalanceProvider: '0x78B73CB97cC961DE49129240C15cdA96c7f1F9cc', // mainnet: '0xDb0f02421f830398d7b59dae8d385e2Cd5ed5CF7',
  governanceSnapshotLink: 'https://snapshot.org/#/seamlessprotocol.eth',
  addresses: {
    GOVERNOR_SHORT: '0xB054EeCDab00C0014C88403A933F6625a8b66eeB', //TODO(wes) mainnet
    GOVERNOR_LONG: '0x4A8d272ce2248f18c0EDe5969e365172C452EdbF', // TOTODO(wes)O mainnet
    MULTICALL_ADDRESS: '0xca11bde05977b3631167028862be2a173976ca11', // mainnet: '0xca11bde05977b3631167028862be2a173976ca11'
  },
  ipfsGateway: 'https://cloudflare-ipfs.com/ipfs',
  fallbackIpfsGateway: 'https://ipfs.io/ipfs',
};
