import { ChainId } from '@aave/contract-helpers';
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
  LENDING_POOL_ADDRESS_PROVIDER: '0x8B85A9e1D8B4bE0Bf9D5081D23d237CEACa114EE',
  LENDING_POOL: '0xdbe84d8fa1287588028b6Bc3Bd2EfbA1b919e8F2',
  WETH_GATEWAY: '0x4f188EaEc55629c11E9967A587b226E43Fa741fd',
  WALLET_BALANCE_PROVIDER: '0x78B73CB97cC961DE49129240C15cdA96c7f1F9cc',
  UI_POOL_DATA_PROVIDER: '0x9B05d122CbC5CC3a30E9A60Bf9BEc4af47aE496c',
  UI_INCENTIVE_DATA_PROVIDER: '0xE60b5E9A5d7baFc8fB570295868BDd9a176e065F',
  L2_ENCODER: '0x4aaf5A3D9f69dFbcC7bd91303e624A55e8F59d0B',
  COLLECTOR: '0x11cbC1a413CFE7d9d25254211f14B978fAb48934',
  FAUCET: '0x99EdE5398F1F1Ca2Bc0113DE3D6627a9FEe4Fa81',
};

const BASE_ADDRESSES = {
  LENDING_POOL_ADDRESS_PROVIDER: '0x0E02EB705be325407707662C6f6d3466E939f3a0',
  LENDING_POOL: '0x8F44Fd754285aa6A2b8B9B97739B79746e0475a7',
  WETH_GATEWAY: '0xaeeB3898edE6a6e86864688383E211132BAa1Af3',
  WALLET_BALANCE_PROVIDER: '0xDb0f02421f830398d7b59dae8d385e2Cd5ed5CF7',
  UI_POOL_DATA_PROVIDER: '0xB7397f841a449793c634C06Cf12751d256b9bf50',
  UI_INCENTIVE_DATA_PROVIDER: '0x3F5a90eF7BC3eE64e1E95b850DbBC2469fF71ce8',
  L2_ENCODER: '0xceceF475167f7BFD8995c0cbB577644b623cD7Cf',
  COLLECTOR: '0x982F3A0e3183896f9970b8A9Ea6B69Cd53AF1089',
  FAUCET: '',
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
      LENDING_POOL_ADDRESS_PROVIDER: BASE_ADDRESSES.LENDING_POOL_ADDRESS_PROVIDER,
      LENDING_POOL: BASE_ADDRESSES.LENDING_POOL,
      WETH_GATEWAY: BASE_ADDRESSES.WETH_GATEWAY,
      WALLET_BALANCE_PROVIDER: BASE_ADDRESSES.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: BASE_ADDRESSES.UI_POOL_DATA_PROVIDER,
      UI_INCENTIVE_DATA_PROVIDER: BASE_ADDRESSES.UI_INCENTIVE_DATA_PROVIDER,
      L2_ENCODER: BASE_ADDRESSES.L2_ENCODER,
      COLLECTOR: BASE_ADDRESSES.COLLECTOR,
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
