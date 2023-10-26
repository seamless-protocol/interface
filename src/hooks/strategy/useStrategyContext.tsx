import { useRootStore } from 'src/store/root';

interface GetXUIData {}

interface GetYUIData {}

export interface StrategyInterface {
  getXData: (params: { user: string }) => Promise<GetXUIData>;
  getYData: () => Promise<GetYUIData>;
}

export const useStrategyContext = () => {
  const [currentMarket, currentNetworkConfig, currentChainId] = useRootStore((store) => [
    store.currentMarket,
    store.currentNetworkConfig,
    store.currentChainId,
  ]);

  const { bridge, name: networkName } = currentNetworkConfig;

  console.log('currentMarket', currentMarket);
  console.log('currentNetworkConfig', currentNetworkConfig);
  console.log('currentChainId', currentChainId);
  console.log('bridge', bridge);
  console.log('networkName', networkName);
};
