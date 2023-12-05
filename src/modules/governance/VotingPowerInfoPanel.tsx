import { Trans } from '@lingui/macro';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { AvatarSize } from 'src/components/Avatar';
import { CompactMode } from 'src/components/CompactableTypography';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { VestedEsSEAMClaimActions } from 'src/components/transactions/VestedEsSEAMClaim/VestedEsSEAMClaimActions';
import { UserDisplay } from 'src/components/UserDisplay';
import { useGovernanceTokens } from 'src/hooks/governance/useGovernanceTokens';
import { usePowers } from 'src/hooks/governance/usePowers';
import { useVestedEsSEAM } from 'src/hooks/governance/useVestedEsSEAM';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { GENERAL } from 'src/utils/mixPanelEvents';

export function VotingPowerInfoPanel() {
  const { currentAccount } = useWeb3Context();
  const { mainTxState: txState, type } = useModalContext();
  const {
    data: { seam, esSEAM },
  } = useGovernanceTokens();
  const { data: vestedEsSEAM, refetch: refetchVestedEsSEAM } = useVestedEsSEAM();
  const { data: powers, refetch: refetchPowers } = usePowers();

  const disableButton = vestedEsSEAM === '0' || type !== undefined;

  useEffect(() => {
    if (txState.success) {
      refetchVestedEsSEAM();
      refetchPowers();
    }
  }, [txState.success, refetchVestedEsSEAM, refetchPowers]);

  return (
    <Paper>
      <Box sx={{ px: 6, pb: 6, pt: 4 }}>
        <Typography variant="h3">
          <Trans>Your info</Trans>
        </Typography>
        <UserDisplay
          withLink={true}
          avatarProps={{ size: AvatarSize.LG }}
          titleProps={{ variant: 'h4', addressCompactMode: CompactMode.MD }}
          subtitleProps={{
            variant: 'caption',
            addressCompactMode: CompactMode.XXL,
            color: 'text.secondary',
          }}
          funnel={'Your info: Governance'}
        />
      </Box>
      <Divider />
      <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {currentAccount && (
          <>
            <Grid container spacing={8}>
              <Grid item md={4}>
                <TextWithTooltip
                  text="Voting power"
                  variant="description"
                  textColor="text.secondary"
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                    eventParams: {
                      tooltip: 'Voting Power',
                      funnel: 'Governance Page',
                    },
                  }}
                >
                  <>
                    <Typography variant="subheader2">
                      <Trans>
                        Your voting power is based on the amount of SEAM + esSEAM that has been
                        delegated to you (you must delegate to yourself to vote with your balance).
                      </Trans>
                    </Typography>
                    <Typography variant="subheader2" mt={4}>
                      <Trans>Use it to vote for or against active proposals.</Trans>
                    </Typography>
                  </>
                </TextWithTooltip>
                <FormattedNumber
                  data-cy={`voting-power`}
                  value={powers?.votingPower || 0}
                  variant="h2"
                  visibleDecimals={2}
                />
              </Grid>
              <Grid item md={4}>
                <Typography typography="description" color="text.secondary">
                  <Trans>SEAM</Trans>
                </Typography>
                <FormattedNumber
                  data-cy={`seam-balance`}
                  value={seam || 0}
                  variant="h2"
                  visibleDecimals={2}
                />
              </Grid>
              <Grid item md={4}>
                <Typography typography="description" color="text.secondary">
                  <Trans>esSEAM</Trans>
                </Typography>
                <FormattedNumber
                  data-cy={`esSEAM-balance`}
                  value={esSEAM || 0}
                  variant="h2"
                  visibleDecimals={2}
                />
              </Grid>
            </Grid>
            <Divider />
            <Box sx={{ display: 'flex', mt: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', mr: '25%' }}>
                <TextWithTooltip
                  text="Claimable SEAM"
                  variant="description"
                  textColor="text.secondary"
                  event={{
                    eventName: GENERAL.TOOL_TIP,
                    eventParams: {
                      tooltip: 'Claimable esSEAM',
                      funnel: 'Governance Page',
                    },
                  }}
                >
                  <>
                    <Typography variant="subheader2">
                      <Trans>Amount of esSEAM that has vested and is claimable as SEAM.</Trans>
                    </Typography>
                  </>
                </TextWithTooltip>
                <FormattedNumber
                  data-cy={`claimable-SEAM`}
                  value={vestedEsSEAM || 0}
                  variant="h2"
                  visibleDecimals={2}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flex: '1 0 33.33%',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '5px',
                }}
              >
                <VestedEsSEAMClaimActions blocked={disableButton} />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
}
