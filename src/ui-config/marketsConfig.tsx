import { ChainId } from '@aave/contract-helpers';
import { AaveV3Base } from '@bgd-labs/aave-address-book';
import { ReactNode } from 'react';

// Enable for premissioned market
// import { PermissionView } from 'src/components/transactions/FlowCommons/PermissionView';

export type MarketDataType = {
  v3?: boolean;
  marketTitle: string;
  // the network the market operates on
  chainId: ChainId;
  enabledFeatures?: {
    liquiditySwap?: boolean;
    staking?: boolean;
    governance?: boolean;
    faucet?: boolean;
    collateralRepay?: boolean;
    incentives?: boolean;
    permissions?: boolean;
    debtSwitch?: boolean;
  };
  isFork?: boolean;
  permissionComponent?: ReactNode;
  disableCharts?: boolean;
  subgraphUrl?: string;
  addresses: {
    LENDING_POOL_ADDRESS_PROVIDER: string;
    LENDING_POOL: string;
    WETH_GATEWAY?: string;
    SWAP_COLLATERAL_ADAPTER?: string;
    REPAY_WITH_COLLATERAL_ADAPTER?: string;
    DEBT_SWITCH_ADAPTER?: string;
    FAUCET?: string;
    PERMISSION_MANAGER?: string;
    WALLET_BALANCE_PROVIDER: string;
    L2_ENCODER?: string;
    UI_POOL_DATA_PROVIDER: string;
    UI_INCENTIVE_DATA_PROVIDER?: string;
    COLLECTOR?: string;
    V3_MIGRATOR?: string;
    GHO_TOKEN_ADDRESS?: string;
    GHO_UI_DATA_PROVIDER?: string;
  };
  /**
   * https://www.hal.xyz/ has integrated aave for healtfactor warning notification
   * the integration doesn't follow aave market naming & only supports a subset of markets.
   * When a halIntegration is specified a link to hal will be displayed on the ui.
   */
  halIntegration?: {
    URL: string;
    marketName: string;
  };
};

export enum CustomMarket {
  //testnet
  proto_base_goerli_v3 = 'proto_base_goerli_v3',
  //mainnet
  proto_base_v3 = 'proto_base_v3',
}

const GOERLI_BASE_ADDRESSES = {
  LENDING_POOL_ADDRESS_PROVIDER: '0x5D5ef54912eb1Aa90F9C8e5C6C2736AD028f9582',
  LENDING_POOL: '0x34B0DA2Eb3D9855B1542b8863d60D3b4A55F2530',
  WETH_GATEWAY: '0x90267dc9b5afc58309b80f67554f0641d39Cf207',
  WALLET_BALANCE_PROVIDER: '0x5EfFD813e13b452aBA993B3fa5f960c64d1B09F8',
  UI_POOL_DATA_PROVIDER: '0x230C3B118eA716BCDAe41B6774402206f2Ed4b8e',
  UI_INCENTIVE_DATA_PROVIDER: '0xad843cFb2b94f8287CCf581ADFFbdb0fB6304c91',
  L2_ENCODER: '0xB9f99178Bd338a6082EEda5A1Da52668E56dd73B',
  COLLECTOR: '',
  FAUCET: '0x636e97830911712BdBf8eD33339D7Dc1D6043a44',
};

export const marketsData: {
  [key in keyof typeof CustomMarket]: MarketDataType;
} = {
  [CustomMarket.proto_base_v3]: {
    marketTitle: 'Base',
    v3: true,
    chainId: ChainId.base,
    enabledFeatures: {
      incentives: true,
    },
    // TODO: Need subgraph, currently not supported
    // subgraphUrl: '',
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: AaveV3Base.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: AaveV3Base.POOL,
      WETH_GATEWAY: AaveV3Base.WETH_GATEWAY,
      WALLET_BALANCE_PROVIDER: AaveV3Base.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: AaveV3Base.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: AaveV3Base.UI_INCENTIVE_DATA_PROVIDER,
      L2_ENCODER: AaveV3Base.L2_ENCODER,
      COLLECTOR: AaveV3Base.COLLECTOR,
      // SWAP_COLLATERAL_ADAPTER: AaveV3Base.SWAP_COLLATERAL_ADAPTER,
      // REPAY_WITH_COLLATERAL_ADAPTER: AaveV3Base.REPAY_WITH_COLLATERAL_ADAPTER,
      // DEBT_SWITCH_ADAPTER: AaveV3Base.DEBT_SWAP_ADAPTER,
    },
  },
  [CustomMarket.proto_base_goerli_v3]: {
    marketTitle: 'Base Görli',
    v3: true,
    chainId: 84531 as ChainId, //ChainId.base_goerli,
    enabledFeatures: {
      faucet: true,
      incentives: true,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: GOERLI_BASE_ADDRESSES.LENDING_POOL_ADDRESS_PROVIDER,
      LENDING_POOL: GOERLI_BASE_ADDRESSES.LENDING_POOL,
      WETH_GATEWAY: GOERLI_BASE_ADDRESSES.WETH_GATEWAY,
      WALLET_BALANCE_PROVIDER: GOERLI_BASE_ADDRESSES.WALLET_BALANCE_PROVIDER,
      //WALLET_BALANCE_PROVIDER:
      UI_POOL_DATA_PROVIDER: GOERLI_BASE_ADDRESSES.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: GOERLI_BASE_ADDRESSES.UI_INCENTIVE_DATA_PROVIDER,
      L2_ENCODER: GOERLI_BASE_ADDRESSES.L2_ENCODER,
      COLLECTOR: GOERLI_BASE_ADDRESSES.COLLECTOR,
      FAUCET: GOERLI_BASE_ADDRESSES.FAUCET,
    },
  },
} as const;
