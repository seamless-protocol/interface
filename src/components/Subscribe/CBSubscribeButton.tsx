import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

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
      isConnected: () => boolean;
    };
  }
}

export function CBSubscribeButton() {
  const { provider } = useWeb3Context();
  const [isSubscribed /*setISubscribed*/] = useState(false);
  const [isLoading /*setIsLoading*/] = useState(true);

  const isBrowserAndConnected = () =>
    typeof window !== 'undefined' && window.ethereum.isConnected();

  const isCB = provider?.connection.url.includes('coinbase');

  const subscribeButtonText = useMemo(() => {
    if (isLoading) return 'Loading...';
    return isSubscribed ? 'Unsubscribe' : 'Subscribe';
  }, [isLoading, isSubscribed]);

  useEffect(() => {
    if (isBrowserAndConnected()) {
      console.log('window', window);
      // window.CBWSubscribe.createSubscriptionUI({
      //   partnerAddress: '0xaf2b090C37f4556BD86E3Cd74740FF0098fad3c6',
      //   partnerName: 'Seamless Protocol',
      //   modalTitle: 'Subscribe to Seamless Protocol',
      //   onSubscriptionChange: () => setISubscribed,
      //   onLoading: () => setIsLoading(false),
      // });
    } else {
      console.error('window.CBWSubscribe is not defined');
    }
  }, []);

  const handleSubscribe = useCallback(() => {
    if (window && window.CBWSubscribe) {
      window.CBWSubscribe.toggleSubscription();
    }
  }, []);

  return isCB ? (
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
  ) : (
    <></>
  );
}
