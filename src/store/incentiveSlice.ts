import {
  ReservesIncentiveDataHumanized,
  UiIncentiveDataProvider,
  UserReservesIncentivesDataHumanized,
  IncentiveDataHumanized,
  UserIncentiveDataHumanized,
  RewardInfoHumanized,
  UserRewardInfoHumanized,
} from '@aave/contract-helpers';
import { StateCreator } from 'zustand';
import { fetchExternalPrice, PRICE_FEED_DECIMALS } from 'src/store/utils/externalPriceFetcher';
import { MOCK_PRICE_ORACLE } from 'src/ui-config/reservePatches';

import { RootStore } from './root';

// TODO: add chain/provider/account mapping
export interface IncentiveSlice {
  reserveIncentiveData?: ReservesIncentiveDataHumanized[];
  userIncentiveData?: UserReservesIncentivesDataHumanized[];
  refreshIncentiveData: () => Promise<void>;
}

const injectExternalPrices = async <T extends RewardInfoHumanized | UserRewardInfoHumanized>({
  rewardOracleAddress,
  priceFeedDecimals,
  rewardPriceFeed,
  rewardTokenAddress,
  ...rest
}: T): Promise<T extends RewardInfoHumanized ? RewardInfoHumanized : UserRewardInfoHumanized> =>
  ({
    ...rest,
    rewardTokenAddress,
    rewardOracleAddress,
    rewardPriceFeed:
      rewardOracleAddress?.toLowerCase() === MOCK_PRICE_ORACLE.toLowerCase()
        ? (await fetchExternalPrice(rewardTokenAddress.toLowerCase())).price
        : rewardPriceFeed,
    priceFeedDecimals:
      rewardOracleAddress?.toLowerCase() === MOCK_PRICE_ORACLE.toLowerCase()
        ? PRICE_FEED_DECIMALS
        : priceFeedDecimals,
  } as any);

const incentiveDataInjectRewardPriceUSD = async (
  incentiveData: IncentiveDataHumanized
): Promise<IncentiveDataHumanized> => ({
  ...incentiveData,
  rewardsTokenInformation: await Promise.all(
    incentiveData.rewardsTokenInformation.map(injectExternalPrices)
  ),
});

const reserveIncentivesInjectRewardPriceUSD = async (
  reserveIncentives: ReservesIncentiveDataHumanized[]
): Promise<ReservesIncentiveDataHumanized[]> => {
  const reps = await Promise.all(
    reserveIncentives.map(async (reserveIncentive) => ({
      ...reserveIncentive,
      aIncentiveData: await incentiveDataInjectRewardPriceUSD(reserveIncentive.aIncentiveData),
      vIncentiveData: await incentiveDataInjectRewardPriceUSD(reserveIncentive.vIncentiveData),
      sIncentiveData: await incentiveDataInjectRewardPriceUSD(reserveIncentive.sIncentiveData),
    }))
  );

  console.log("reps", reps);
  return reps;
}
  

const userIncentiveDataInjectRewardPriceUSD = async (
  incentiveData: UserIncentiveDataHumanized
): Promise<UserIncentiveDataHumanized> => ({
  ...incentiveData,
  userRewardsInformation: await Promise.all(
    incentiveData.userRewardsInformation.map(injectExternalPrices)
  ),
});

const userIncentivesInjectRewardPriceUSD = async (
  userIncentives: UserReservesIncentivesDataHumanized[]
): Promise<UserReservesIncentivesDataHumanized[]> => {
  const resp = await Promise.all(
    userIncentives.map(async (userIncentive) => ({
      ...userIncentive,
      aTokenIncentivesUserData: await userIncentiveDataInjectRewardPriceUSD(
        userIncentive.aTokenIncentivesUserData
      ),
      vTokenIncentivesUserData: await userIncentiveDataInjectRewardPriceUSD(
        userIncentive.vTokenIncentivesUserData
      ),
      sTokenIncentivesUserData: await userIncentiveDataInjectRewardPriceUSD(
        userIncentive.sTokenIncentivesUserData
      ),
    }))
  );

  console.log("resp: ", resp);
  return resp;
}
  

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

    try {
      promises.push(
        poolDataProviderContract
          .getReservesIncentivesDataHumanized({
            lendingPoolAddressProvider: currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER,
          })
          .then(reserveIncentivesInjectRewardPriceUSD)
          .then((reserveIncentiveData) => set({ reserveIncentiveData }))
      );
      if (account) {
        promises.push(
          poolDataProviderContract
            .getUserReservesIncentivesDataHumanized({
              lendingPoolAddressProvider: currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER,
              user: account,
            })
            .then(userIncentivesInjectRewardPriceUSD)
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
