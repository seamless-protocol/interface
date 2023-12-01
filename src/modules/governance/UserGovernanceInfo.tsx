import { Trans } from '@lingui/macro';
import { Paper, Typography } from '@mui/material';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { useRootStore } from 'src/store/root';
import { VotingPowerInfoPanel } from './VotingPowerInfoPanel';

export const UserGovernanceInfo = () => {
  console.log('Uso u user governance info component');
  const account = useRootStore((state) => state.account);

  console.log(account);

  return account ? (
    <>
      <VotingPowerInfoPanel />
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
