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
const IGNORE_ADDRESSES = ['0x5607718c64334eb5174CB2226af891a6ED82c7C6'];
const REPLACE_ADDRESSES: { [key: string]: string } = {
  ['0x998e44232bef4f8b033e5a5175bdc97f2b10d5e5']: '0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85',
};

export const fetchExternalPrice = async (
  address: string
): Promise<{ price: string; coingGeckoId: string }> => {
  address = address.toLowerCase();
  return {
    price: await queryClient.fetchQuery({
      queryKey: ['fetchExternalPrice', 'price', address],
      queryFn: () => getCoinGeckoPriceUSD(address),
    }),
    coingGeckoId: await queryClient.fetchQuery({
      queryKey: ['fetchExternalPrice', 'coingGeckoId', address],
      queryFn: () => getCoinGeckoCoinDetails(address),
    }),
  };
};

const getCoinGeckoPriceUSD = async (address: string): Promise<string> => {
  try {
    address = REPLACE_ADDRESSES[address]?.toLowerCase() || address;
    if (IGNORE_ADDRESSES.find((val) => val.toLowerCase() === address) !== undefined) {
      return '0';
    }
    const resp = await fetch(
      `https://cg-price-cache.seamlessprotocol.com/simple/token_price/${CHAIN_ID}?contract_addresses=${address}&vs_currencies=usd&precision=${PRICE_FEED_DECIMALS}`
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
    address = REPLACE_ADDRESSES[address]?.toLowerCase() || address;
    if (IGNORE_ADDRESSES.find((val) => val.toLowerCase() === address) !== undefined) {
      return '';
    }
    const resp = await fetch(
      `https://cg-price-cache.seamlessprotocol.com/coins/id/contract/${address}`
    );

    const { web_slug } = await resp.json();

    return web_slug;
  } catch (err) {
    console.error(`Error: Failed to fetch ${address} coin details from CoinGecko: `, err);
    throw err;
  }
};
