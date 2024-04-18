import { parseUnits } from 'ethers/lib/utils';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 30 min
      keepPreviousData: true,
      retry: true,
    },
  },
});

export const CHAIN_ID = 'base';
export const PRICE_FEED_DECIMALS = 8;

export const fetchExternalPrice = async (
  address: string
): Promise<{ price: string; coingGeckoId: string }> => ({
  price: await queryClient.fetchQuery({
    queryKey: ['fetchExternalPrice', 'price', address],
    queryFn: () => getCoinGeckoPriceUSD(address),
  }),
  coingGeckoId: await queryClient.fetchQuery({
    queryKey: ['fetchExternalPrice', 'coingGeckoId', address],
    queryFn: () => getCoinGeckoCoinDetails(address),
  }),
});

const getCoinGeckoPriceUSD = async (address: string): Promise<string> => {
  try {
    const resp = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/${CHAIN_ID}?contract_addresses=${address}&vs_currencies=usd&precision=${PRICE_FEED_DECIMALS}`
    );

    const {
      [address]: { usd: price },
    } = await resp.json();

    return parseUnits(price.toString(), PRICE_FEED_DECIMALS).toString();
  } catch (err) {
    console.error(`Error: Failed to fetch ${address} price from CoinGecko: `, err);
    throw err;
  }
};

const getCoinGeckoCoinDetails = async (address: string): Promise<string | undefined> => {
  try {
    const resp = await fetch(`https://api.coingecko.com/api/v3/coins/id/contract/${address}`);

    const { web_slug } = await resp.json();

    return web_slug;
  } catch (err) {
    console.error(`Error: Failed to fetch ${address} price from CoinGecko: `, err);
    throw err;
  }
};
