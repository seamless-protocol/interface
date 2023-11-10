import { ChainId } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Box, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { Warning } from 'src/components/primitives/Warning';
import { useRootStore } from 'src/store/root';
import { NetworkConfig } from 'src/ui-config/networksConfig';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { Link } from '../../../../components/primitives/Link';

type WalletEmptyInfoProps = Pick<NetworkConfig, 'bridge' | 'name'> & {
  chainId: number;
  icon?: boolean;
  sx?: SxProps<Theme>;
};

export function WalletEmptyInfo({ bridge, name, chainId, icon, sx }: WalletEmptyInfoProps) {
  const network = [ChainId.avalanche].includes(chainId) ? 'Ethereum & Bitcoin' : 'Ethereum';
  const [trackEvent, isLifiWidgetOpen, setLifiWidgetOpen] = useRootStore((state) => [
    state.trackEvent,
    state.isLifiWidgetOpen,
    state.setLifiWidgetOpen,
  ]);

  return (
    <Warning severity="info" icon={icon} sx={sx}>
      {bridge ? (
        <Trans>
          Your {name} wallet is empty.{' '}
          <Box
            component="span"
            onClick={() => {
              if (!isLifiWidgetOpen) {
                setLifiWidgetOpen(true);
              }
            }}
            sx={{
              textDecoration: 'underline',
              cursor: isLifiWidgetOpen ? 'inherit' : 'pointer',
              color: isLifiWidgetOpen ? 'text.disabled' : 'inherit',
            }}
          >
            Purchase or transfer assets
          </Box>{' '}
          or use{' '}
          {
            <Link
              onClick={() => {
                trackEvent(GENERAL.EXTERNAL_LINK, { bridge: bridge.name, Link: 'Bridge Link' });
              }}
              href={bridge.url}
            >
              {bridge.name}
            </Link>
          }{' '}
          to transfer your {network} assets.
        </Trans>
      ) : (
        <Trans>Your {name} wallet is empty. Purchase or transfer assets.</Trans>
      )}
    </Warning>
  );
}
