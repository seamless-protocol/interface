import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Button, SvgIcon, Typography } from '@mui/material';
import { useRootStore } from 'src/store/root';

import { NetworkConfig } from '../ui-config/networksConfig';

export const LifiBridgeButton = ({ bridge }: Pick<NetworkConfig, 'bridge'>) => {
  const [isLifiWidgetOpen, setLifiWidgetOpen] = useRootStore((state) => [
    state.isLifiWidgetOpen,
    state.setLifiWidget,
  ]);

  if (!bridge) return null;

  return (
    <Button
      startIcon={<img src={bridge.icon} alt={bridge.name} style={{ width: 14, height: 14 }} />}
      endIcon={
        <SvgIcon sx={{ width: 14, height: 14 }}>
          <ExternalLinkIcon />
        </SvgIcon>
      }
      onClick={() => setLifiWidgetOpen(true)}
      size="small"
      variant="outlined"
      disabled={isLifiWidgetOpen}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        mb: '8px',
        color: 'black',
        backgroundColor: theme.palette.background.lifi,
        borderColor: theme.palette.primary.main,
        '&:hover': {
          color: 'black',
          backgroundColor: theme.palette.background.lifi,
          borderColor: theme.palette.primary.main,
        },
      })}
    >
      <Typography variant="buttonS">LI.FI Bridge</Typography>
    </Button>
  );
};
