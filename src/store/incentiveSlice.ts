import {
  ReservesIncentiveDataHumanized,
  UiIncentiveDataProvider,
  UserReservesIncentivesDataHumanized,
  IncentiveDataHumanized,
  UserIncentiveDataHumanized,
} from '@aave/contract-helpers';
import { StateCreator } from 'zustand';
import { fetchExternalPrice, PRICE_FEED_DECIMALS } from 'src/store/utils/externalPriceFetcher';
import { governanceConfig } from 'src/ui-config/governanceConfig';

import { RootStore } from './root';

// TODO: add chain/provider/account mapping
export interface IncentiveSlice {
  reserveIncentiveData?: ReservesIncentiveDataHumanized[];
  userIncentiveData?: UserReservesIncentivesDataHumanized[];
  refreshIncentiveData: () => Promise<void>;
}

const SEAM_SYMBOL = 'SEAM';
const esSEAM_SYMBOL = 'esSEAM';
const SEAM_SYMBOLS = [SEAM_SYMBOL, esSEAM_SYMBOL];
const OG_POINTS_SYMBOL = 'OG Points';
const SEAM_ADDRESS = governanceConfig.seamTokenAddress.toLowerCase();

const incentiveDataInjectSEAMPriceUSD = (
  incentiveData: IncentiveDataHumanized,
  seamPriceUSD: string
): IncentiveDataHumanized => ({
  ...incentiveData,
  rewardsTokenInformation: incentiveData.rewardsTokenInformation.map((incentive) => ({
    ...incentive,
    rewardPriceFeed:
      SEAM_SYMBOLS.includes(incentive.rewardTokenSymbol)
        ? seamPriceUSD
        : incentive.rewardTokenSymbol === OG_POINTS_SYMBOL
        ? '0'
        : incentive.rewardPriceFeed,
    priceFeedDecimals:
      SEAM_SYMBOLS.includes(incentive.rewardTokenSymbol)
        ? PRICE_FEED_DECIMALS
        : incentive.priceFeedDecimals,
  })),
});

const reserveIncentivesInjectSEAMPriceUSD = (
  reserveIncentives: ReservesIncentiveDataHumanized[],
  seamPriceUSD: string
): ReservesIncentiveDataHumanized[] =>
  reserveIncentives.map((reserveIncentive) => ({
    ...reserveIncentive,
    aIncentiveData: incentiveDataInjectSEAMPriceUSD(reserveIncentive.aIncentiveData, seamPriceUSD),
    vIncentiveData: incentiveDataInjectSEAMPriceUSD(reserveIncentive.vIncentiveData, seamPriceUSD),
    sIncentiveData: incentiveDataInjectSEAMPriceUSD(reserveIncentive.sIncentiveData, seamPriceUSD),
  }));

const userIncentiveDataInjectSEAMPriceUSD = (
  incentiveData: UserIncentiveDataHumanized,
  seamPriceUSD: string
): UserIncentiveDataHumanized => ({
  ...incentiveData,
  userRewardsInformation: incentiveData.userRewardsInformation.map((incentive) => ({
    ...incentive,
    rewardPriceFeed:
      SEAM_SYMBOLS.includes(incentive.rewardTokenSymbol)
        ? seamPriceUSD
        : incentive.rewardTokenSymbol === OG_POINTS_SYMBOL
        ? '0'
        : incentive.rewardPriceFeed,
    priceFeedDecimals:
      SEAM_SYMBOLS.includes(incentive.rewardTokenSymbol)
        ? PRICE_FEED_DECIMALS
        : incentive.priceFeedDecimals,
  })),
});

const userIncentivesInjectSEAMPriceUSD = (
  userIncentives: UserReservesIncentivesDataHumanized[],
  seamPriceUSD: string
): UserReservesIncentivesDataHumanized[] =>
  userIncentives.map((userIncentive) => ({
    ...userIncentive,
    aTokenIncentivesUserData: userIncentiveDataInjectSEAMPriceUSD(
      userIncentive.aTokenIncentivesUserData,
      seamPriceUSD
    ),
    vTokenIncentivesUserData: userIncentiveDataInjectSEAMPriceUSD(
      userIncentive.vTokenIncentivesUserData,
      seamPriceUSD
    ),
    sTokenIncentivesUserData: userIncentiveDataInjectSEAMPriceUSD(
      userIncentive.sTokenIncentivesUserData,
      seamPriceUSD
    ),
  }));

export const createIncentiveSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  IncentiveSlice
> = (set, get) => ({
  refreshIncentiveData: async () => {
    const account = get().account;
    const currentMarketData = get().currentMarketData;
    const currentChainId = get().currentChainId;
    if (!currentMarketData.addresses.UI_INCENTIVE_DATA_PROVIDER) return;
    const poolDataProviderContract = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress: currentMarketData.addresses.UI_INCENTIVE_DATA_PROVIDER,
      provider: get().jsonRpcProvider(),
      chainId: currentChainId,
    });
    const promises: Promise<void>[] = [];

    const seamExternalPrice = await fetchExternalPrice(SEAM_ADDRESS);

    try {
      promises.push(
        poolDataProviderContract
          .getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider: currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER,
          })
          .then((reserveIncentives) =>
            reserveIncentivesInjectSEAMPriceUSD(reserveIncentives, seamExternalPrice.price)
          )
          .then((reserveIncentiveData) => set({ reserveIncentiveData }))
      );
      if (account) {
        promises.push(
          poolDataProviderContract
            .getUserReservesIncentivesDataHumanized({
              lendingPoolAddressProvider: currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER,
              user: account,
            })
            .then((userIncentiveData) =>
              userIncentivesInjectSEAMPriceUSD(userIncentiveData, seamExternalPrice.price)
            )
            .then((userIncentiveData) =>
              set({
                userIncentiveData,
              })
            )
        );
      }
      await Promise.all(promises);
    } catch (e) {
      console.log('error fetching incentives');
    }
  },
});
