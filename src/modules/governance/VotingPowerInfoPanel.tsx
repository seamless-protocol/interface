import { Trans } from '@lingui/macro';
import { Box, Paper, Typography } from '@mui/material';
import { AvatarSize } from 'src/components/Avatar';
import { CompactMode } from 'src/components/CompactableTypography';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { UserDisplay } from 'src/components/UserDisplay';
import { usePowers } from 'src/hooks/governance/usePowers';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { GENERAL } from 'src/utils/mixPanelEvents';

export function VotingPowerInfoPanel() {
  const { currentAccount } = useWeb3Context();
  const { data: powers } = usePowers();
  return (
    <Paper sx={{ px: 6, pb: 6, pt: 4 }}>
      <Typography
        variant="h3"
        sx={{ height: '36px', display: 'flex', alignItems: 'center', mb: 4 }}
      >
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
      {currentAccount && (
        <Box sx={{ display: 'flex', mt: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', mr: '25%' }}>
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
                    Your voting power is based on the amount of SEAM + esSEAM that has been delegated to you (you must delegate to yourself to vote with your balance).
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
          </Box>
        </Box>
      )}
    </Paper>
  );
}
