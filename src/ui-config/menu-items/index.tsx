import {
  BookOpenIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  GiftIcon,
} from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { ReactNode } from 'react';
import { ROUTES } from 'src/components/primitives/Link';
import { ENABLE_TESTNET } from 'src/utils/marketsAndNetworksConfig';

import { MarketDataType } from '../marketsConfig';

interface Navigation {
  link: string;
  title: string;
  isVisible?: (data: MarketDataType) => boolean | undefined;
  dataCy?: string;
  action?: () => void;
  disabled?: boolean;
}

export const navigation: Navigation[] = [
  {
    link: ROUTES.markets,
    title: t`All Markets`,
    dataCy: 'menuMarkets',
  },
  {
    link: ROUTES.dashboard,
    title: t`Supply & Borrow Dashboard`,
    dataCy: 'menuDashboard',
  },
  {
    link: '',
    title: t`Bridge to Base`,
    dataCy: 'swapBase',
    disabled: false,
  },
  {
    link: ROUTES.staking,
    title: t`Stake`,
    dataCy: 'menuStake',
    isVisible: () =>
      process.env.NEXT_PUBLIC_ENABLE_STAKING === 'true' &&
      process.env.NEXT_PUBLIC_ENV === 'prod' &&
      !ENABLE_TESTNET,
  },
  {
    link: ROUTES.governance,
    title: t`Governance`,
    dataCy: 'menuGovernance',
    isVisible: () =>
      process.env.NEXT_PUBLIC_ENABLE_GOVERNANCE === 'true' &&
      process.env.NEXT_PUBLIC_ENV === 'prod' &&
      !ENABLE_TESTNET,
  },
  {
    link: ROUTES.faucet,
    title: t`Faucet`,
    isVisible: () => process.env.NEXT_PUBLIC_ENV === 'staging' || ENABLE_TESTNET,
  },
];

interface MoreMenuItem extends Navigation {
  icon: ReactNode;
  makeLink?: (walletAddress: string) => string;
}

const moreMenuItems: MoreMenuItem[] = [
  {
    link: ROUTES.farms,
    title: t`Staking Farms`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
  {
    link: ROUTES.airdrop,
    title: t`Claim Airdrop`,
    icon: <GiftIcon />,
  },
  {
    link: 'https://docs.seamlessprotocol.com/overview/faq',
    title: t`FAQ`,
    icon: <QuestionMarkCircleIcon />,
  },
  {
    link: 'https://github.com/seamless-protocol',
    title: t`Github`,
    icon: <BookOpenIcon />,
  },
];

const fiatEnabled = process.env.NEXT_PUBLIC_FIAT_ON_RAMP;
if (fiatEnabled === 'true') {
  moreMenuItems.push({
    link: 'https://global.transak.com',
    makeLink: (walletAddress) =>
      `${process.env.NEXT_PUBLIC_TRANSAK_APP_URL}/?apiKey=${process.env.NEXT_PUBLIC_TRANSAK_API_KEY}&walletAddress=${walletAddress}&disableWalletAddressForm=true`,
    title: t`Buy Crypto With Fiat`,
    icon: <CreditCardIcon />,
  });
}
export const moreNavigation: MoreMenuItem[] = [...moreMenuItems];
