import { Trans } from '@lingui/macro';
import { Grid, Paper, Typography } from '@mui/material';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { useRootStore } from 'src/store/root';

import { DelegatedInfoPanel } from './DelegatedInfoPanel';
import { VotingPowerInfoPanel } from './VotingPowerInfoPanel';

export const UserGovernanceInfo = () => {
  const account = useRootStore((state) => state.account);

  return account ? (
    <>
      <Grid item md={6}>
        <VotingPowerInfoPanel />
      </Grid>
      <Grid item md={6}>
        <DelegatedInfoPanel />
      </Grid>
    </>
  ) : (
    <Paper sx={{ p: 6 }}>
      <Typography variant="h3" sx={{ mb: { xs: 6, xsm: 10 } }}>
        <Trans>Your info</Trans>
      </Typography>
      <Typography sx={{ mb: 6 }} color="text.secondary">
        <Trans>Please connect a wallet to view your personal information here.</Trans>
      </Typography>
      <ConnectWalletButton funnel="Governance Page" />
    </Paper>
  );
};
