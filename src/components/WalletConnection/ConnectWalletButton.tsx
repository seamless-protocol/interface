import { Trans } from '@lingui/macro';
import { Button } from '@mui/material';
import { useWalletModalContext } from 'src/hooks/useWalletModal';
import { useRootStore } from 'src/store/root';
import { AUTH } from 'src/utils/mixPanelEvents';

import { WalletModal } from './WalletModal';

export interface ConnectWalletProps {
  funnel?: string;
}

export const ConnectWalletButton: React.FC<ConnectWalletProps> = ({ funnel }) => {
  const { setWalletModalOpen } = useWalletModalContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <>
      <Button
        onClick={() => {
          trackEvent(AUTH.CONNECT_WALLET, { funnel: funnel });
          setWalletModalOpen(true);
        }}
        sx={(theme) => ({
          color: theme.palette.text.links,
          backgroundColor: theme.palette.background.surface,
          borderColor: theme.palette.primary.main,
          '&:hover': {
            color: theme.palette.text.links,
            backgroundColor: theme.palette.background.surface,
            borderColor: theme.palette.primary.main,
          },
        })}
      >
        <Trans>Connect wallet</Trans>
      </Button>
      <WalletModal />
    </>
  );
};
