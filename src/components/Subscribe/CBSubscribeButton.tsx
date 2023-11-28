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
        modalBody: string;
        onSubscriptionChange: (isSubscribed: boolean) => void;
        onLoading: (isLoading: boolean) => void;
      }) => void;
      toggleSubscription: () => void;
    };
  }
}

const MODAL_BODY_TEXT = `Receive the latest updates, promotions, and alerts directly in your wallet!
Powered by Coinbase`;

export function CBSubscribeButton() {
  const { provider, connected, readOnlyMode } = useWeb3Context();
  const [isSubscribed, setISubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isCB = provider?.connection.url.includes('coinbase');

  const subscribeButtonText = isLoading ? 'Loading...' : isSubscribed ? 'Unsubscribe' : 'Subscribe';

  useEffect(() => {
    if (provider && connected && !readOnlyMode && window.CBWSubscribe) {
      window.CBWSubscribe.createSubscriptionUI({
        partnerAddress: '0x1503f06d951440fbfA211341D3399Beb3C642414',
        partnerName: 'Seamless Protocol',
        modalTitle: 'Subscribe to Seamless updates',
        modalBody: MODAL_BODY_TEXT,
        onSubscriptionChange: () => setISubscribed,
        onLoading: () => setIsLoading(false),
      });
    } else {
      console.error('window.CBWSubscribe is not defined');
    }
  }, [provider, connected, readOnlyMode]);

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
