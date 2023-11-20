import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Box, Button, SvgIcon, Typography } from '@mui/material';
import { useRootStore } from 'src/store/root';

export const LifiBridgeButton = () => {
  const [isLifiWidgetOpen, setLifiWidgetOpen] = useRootStore((state) => [
    state.isLifiWidgetOpen,
    state.setLifiWidgetOpen,
  ]);

  return (
    <Button
      startIcon={
        <Box
          component="img"
          src="/icons/lifi.svg"
          alt="lifi logo"
          sx={{
            width: 14,
            height: 14,
          }}
        />
      }
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
