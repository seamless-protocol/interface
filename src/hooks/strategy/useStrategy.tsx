import { createContext, ReactNode, useContext } from 'react';

interface GetCurrentCollateralRatio {
  collateralRatio: bigint;
}

interface GetCollateralRatioTargets {
  target: bigint;
  min: bigint;
  maxForRebalance: bigint;
}

interface GetPosition {
  maxWithdraw: bigint;
}

interface GetPoolCollateral {
  collateral: bigint;
}

export interface StrategyInterface {
  getCurrentCollateralRatio: (poolAddress: string) => Promise<GetCurrentCollateralRatio>;
  getCollateralRatioTargets: (poolAddress: string) => Promise<GetCollateralRatioTargets>;
  getPosition: (userAddress: string) => Promise<GetPosition>;
  getPoolCollateral: (poolAddress: string) => Promise<GetPoolCollateral>;
  //getAPY: () => Promise<GetAPY>;
}

interface StrategyData {
  targetMultiple: string;
  minMultiple: string;
  maxMultiple: string;
  userPosition: string;
  poolPosition: string;
  //apy: bigint;
}

const getStrategyData = (): StrategyData => {
  /*
    Strategy Data from Smart Contracts
  */

  //const { currentCollateralRatio } = getCollateralRatio(address);
  //const { target, maxForRebalance } = getCollateralRatioTargets(address);
  //const { maxWithdraw } = getPosition(address);
  //const { collateral } = getPoolCollateral(address);

  /*
    Aggregated Data
  */

  // const targetMultiple = target / (target - 1e8);
  // const minMultiple = min / (min - 1e8);
  // const maxMultiple = maxForRebalance / (maxForRebalance - 1e8);

  // const actualMultiple = currentCollateralRatio / (currentCollateralRatio - 1e8);

  // const userPosition =
  const strategyData: StrategyData = {
    targetMultiple: 'tbd',
    minMultiple: 'tbd',
    maxMultiple: 'tbd',
    userPosition: 'tbd',
    poolPosition: 'tbd',
    //apy: 0n,
  };
  return strategyData;
};

/*
  Strategy Context
*/
const StrategyContext = createContext({} /*as StrategyData*/);

/*
  Strategy Provider Component
*/
export const StrategyProvider = ({
  children,
  asset,
}: {
  children: ReactNode;

  /// TODO
  asset: 'asset';
}): JSX.Element | null => {
  // Return if no reserve is provided
  if (!asset) {
    console.warn('<StrategyProvider /> was not given a valid reserve asset to parse');
    return null;
  }

  const providerValue = getStrategyData(/*asset*/);

  return <StrategyContext.Provider value={providerValue}>{children}</StrategyContext.Provider>;
};

/*
  useAssetCaspsContext hook
*/

export const useStrategy = () => {
  const context = useContext(StrategyContext);

  if (context === undefined) {
    throw new Error(
      'useStrategy() can only be used inside of <StrategyProvider />, ' +
        'please declare it at a higher level.'
    );
  }

  return context;
};
