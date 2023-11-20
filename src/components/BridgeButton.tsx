import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Button, SvgIcon, Typography } from '@mui/material';

import { NetworkConfig } from '../ui-config/networksConfig';
import { Link } from './primitives/Link';

export const BridgeButton = ({ bridge }: Pick<NetworkConfig, 'bridge'>) => {
  if (!bridge) return null;

  return (
    <Button
      startIcon={<img src={bridge.icon} alt={bridge.name} style={{ width: 14, height: 14 }} />}
      endIcon={
        <SvgIcon sx={{ width: 14, height: 14 }}>
          <ExternalLinkIcon />
        </SvgIcon>
      }
      component={Link}
      size="small"
      variant="outlined"
      href={bridge.url || ''}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        mb: '8px',
        color: theme.palette.text.links,
        backgroundColor: theme.palette.background.base,
        borderColor: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.text.links,
          backgroundColor: theme.palette.background.base,
          borderColor: theme.palette.primary.main,
        },
      })}
    >
      <Typography variant="buttonS">{bridge.name}</Typography>
    </Button>
  );
};
