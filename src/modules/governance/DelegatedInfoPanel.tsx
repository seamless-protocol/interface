import { Trans } from '@lingui/macro';
import { Button, Divider, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { constants } from 'ethers';
import { AvatarSize } from 'src/components/Avatar';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { ExternalUserDisplay } from 'src/components/UserDisplay';
import { useGovernanceTokens } from 'src/hooks/governance/useGovernanceTokens';
import { usePowers } from 'src/hooks/governance/usePowers';
import { useModalContext } from 'src/hooks/useModal';
import { useRootStore } from 'src/store/root';

type DelegatedPowerProps = {
  user: string;
  seamPower: string;
  esSEAMPower: string;
  seamDelegatee: string;
  esSEAMDelegatee: string;
  title: string;
};

const DelegatedPower: React.FC<DelegatedPowerProps> = ({
  seamPower,
  esSEAMPower,
  seamDelegatee,
  esSEAMDelegatee,
  title,
}) => {
  const isSEAMDelegated = seamDelegatee !== constants.AddressZero;
  const isEsSEAMDelegated = esSEAMDelegatee !== constants.AddressZero;

  if (!isSEAMDelegated && !isEsSEAMDelegated) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 6 }}>
      <Typography typography="caption" sx={{ mb: 5 }} color="text.secondary">
        <Trans>{title}</Trans>
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
        {seamDelegatee === esSEAMDelegatee && isSEAMDelegated ? (
          <Row
            align="flex-start"
            caption={
              <ExternalUserDisplay
                avatarProps={{ size: AvatarSize.XS }}
                titleProps={{ variant: 'subheader1' }}
                address={seamDelegatee}
              />
            }
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TokenIcon symbol="SEAM" sx={{ width: 16, height: 16 }} />
              <FormattedNumber
                value={Number(seamPower) + Number(esSEAMPower)}
                variant="subheader1"
              />
              <Typography variant="helperText" color="text.secondary">
                SEAM + esSEAM
              </Typography>
            </Box>
          </Row>
        ) : (
          <>
            {isSEAMDelegated && (
              <Row
                align="flex-start"
                caption={
                  <ExternalUserDisplay
                    avatarProps={{ size: AvatarSize.XS }}
                    titleProps={{ variant: 'subheader1' }}
                    address={seamDelegatee}
                  />
                }
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TokenIcon symbol="SEAM" sx={{ width: 16, height: 16 }} />
                  <FormattedNumber value={seamPower} variant="subheader1" />
                  <Typography variant="helperText" color="text.secondary">
                    SEAM
                  </Typography>
                </Box>
              </Row>
            )}
            {isEsSEAMDelegated && (
              <Row
                align="flex-start"
                caption={
                  <ExternalUserDisplay
                    avatarProps={{ size: AvatarSize.XS }}
                    titleProps={{ variant: 'subheader1' }}
                    address={esSEAMDelegatee}
                  />
                }
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TokenIcon symbol="esSEAM" sx={{ width: 16, height: 16 }} />
                  <FormattedNumber value={esSEAMPower} variant="subheader1" />
                  <Typography variant="helperText" color="text.secondary">
                    esSEAM
                  </Typography>
                </Box>
              </Row>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export const DelegatedInfoPanel = () => {
  const address = useRootStore((store) => store.account);
  const {
    data: { seam, esSEAM },
  } = useGovernanceTokens();
  const { data: powers } = usePowers();
  const { openGovDelegation, openRevokeGovDelegation } = useModalContext();

  if (!powers || !address) return null;

  const disableButton = Number(seam) <= 0 && Number(esSEAM) <= 0;

  const hasDelegated =
    powers.seamVotingDelegatee !== constants.AddressZero ||
    powers.esSEAMVotingDelegatee !== constants.AddressZero;

  return (
    <Paper>
      <Box sx={{ px: 6, pb: 4, pt: 4 }}>
        <Typography typography="h3">
          <Trans>Delegated power</Trans>
        </Typography>
        <Typography typography="description" sx={{ mt: 1 }} color="text.secondary">
          <Trans>
            All SEAM tokens have voting power, but in order to activate this voting power, SEAM/esSEAM must
            first be delegated. Note: Delegation does not transfer token ownership, it only grants
            “Voting Power” to the delegated address. You can either self-delegate or delegate this
            voting power to others and you can change your delegation at anytime. To view active
            community members who are interested in receiving delegation, click{' '}
            <a href="https://seamlessprotocol.discourse.group/t/seamless-community-representatives/42">
              here
            </a>
            .
          </Trans>
        </Typography>
        {disableButton ? (
          <Typography variant="description" color="text.muted" mt={6}>
            <Trans>You have no SEAM/esSEAM to delegate.</Trans>
          </Typography>
        ) : (
          <>
            <DelegatedPower
              seamPower={seam}
              esSEAMPower={esSEAM}
              seamDelegatee={powers.seamVotingDelegatee}
              esSEAMDelegatee={powers.esSEAMVotingDelegatee}
              user={address}
              title="Voting power"
            />
          </>
        )}
      </Box>
      <Divider />
      <Box sx={{ py: 4, px: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          size="large"
          sx={{ width: '100%' }}
          variant="contained"
          disabled={disableButton}
          onClick={() => openGovDelegation()}
        >
          {hasDelegated ? <Trans>Change delegation</Trans> : <Trans>Set up delegation</Trans>}
        </Button>
        {hasDelegated && (
          <Button
            size="large"
            sx={(theme) => ({
              width: '100%',
              backgroundColor: theme.palette.background.surface,
              color: theme.palette.text.links,
              '&:hover': { backgroundColor: theme.palette.background.surface },
            })}
            variant="outlined"
            disabled={disableButton}
            onClick={() => openRevokeGovDelegation()}
          >
            <Trans>Revoke power</Trans>
          </Button>
        )}
      </Box>
    </Paper>
  );
};
