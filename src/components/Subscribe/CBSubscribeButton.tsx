import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

declare global {
  interface Window {
    CBWSubscribe: {
      createSubscriptionUI: (options: {
        partnerAddress: string;
        partnerName: string;
        modalTitle: string;
        onSubscriptionChange: (isSubscribed: boolean) => void;
        onLoading: (isLoading: boolean) => void;
      }) => void;
      toggleSubscription: () => void;
    };
    ethereum: {
      providers: {
        isCoinbaseWallet: boolean;
        isCoinbaseBrowser: boolean;
      }[];
    };
  }
}

export function CBSubscribeButton() {
  const [isSubscribed, setISubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCB, setIsCB] = useState<boolean>(false);
  const subscribeButtonText = useMemo(() => {
    if (isLoading) return 'Loading...';
    return isSubscribed ? 'Unsubscribe' : 'Subscribe';
  }, [isLoading, isSubscribed]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.CBWSubscribe) {
      window.CBWSubscribe.createSubscriptionUI({
        partnerAddress: '0xaf2b090C37f4556BD86E3Cd74740FF0098fad3c6',
        partnerName: 'Seamless Protocol',
        modalTitle: 'Subscribe to Seamless Protocol',
        onSubscriptionChange: setISubscribed,
        onLoading: setIsLoading,
      });
    } else {
      console.error('window.CBWSubscribe is not defined');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum.providers) {
      const provider = window.ethereum.providers.find(
        ({ isCoinbaseWallet, isCoinbaseBrowser }) => isCoinbaseWallet || isCoinbaseBrowser
      );
      console.log('provider', provider);
      setIsCB(!!provider);
    } else {
      console.error('window.ethereum is not defined');
    }
  }, []);

  const handleSubscribe = useCallback(() => {
    if (window && window.CBWSubscribe) {
      window.CBWSubscribe.toggleSubscription();
    }
  }, []);

  return (
    <Button
      onClick={handleSubscribe}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.subscribe,
        color: theme.palette.text.links,
        borderColor: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.text.links,
          backgroundColor: theme.palette.background.subscribe,
          borderColor: theme.palette.primary.main,
        },
      })}
    >
      {subscribeButtonText}
    </Button>
  );
}
