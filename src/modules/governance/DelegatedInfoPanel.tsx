import { Trans } from '@lingui/macro';
import { Button, Divider, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { constants } from 'ethers';
import { AvatarSize } from 'src/components/Avatar';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { ExternalUserDisplay } from 'src/components/UserDisplay';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 6, mb: 2 }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
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
  const { data: powers } = usePowers();
  const { openGovDelegation, openRevokeGovDelegation } = useModalContext();

  if (!powers || !address) return null;

  const disableButton =
    Number(powers.seamTokenPower) <= 0 &&
    Number(powers.esSEAMTokenPower) <= 0 &&
    powers.seamVotingDelegatee === '' &&
    powers.esSEAMVotingDelegatee === '';

  const showRevokeButton = powers.seamVotingDelegatee !== '' || powers.esSEAMVotingDelegatee !== '';

  return (
    <Paper>
      <Box sx={{ px: 6, pb: 6, pt: 4 }}>
        <Typography typography="h3">
          <Trans>Delegated power</Trans>
        </Typography>
        <Typography typography="description" sx={{ mt: 1 }} color="text.secondary">
          <Trans>
            Use your SEAM and esSEAM balance to delegate your voting power. You will not be sending
            any tokens, only the rights to vote and propose changes to the protocol. You can
            re-delegate at any time.
          </Trans>
        </Typography>
        {disableButton ? (
          <Typography variant="description" color="text.muted" mt={6}>
            <Trans>You have no SEAM/esSEAM balance to delegate.</Trans>
          </Typography>
        ) : (
          <>
            <DelegatedPower
              seamPower={powers.seamTokenPower}
              esSEAMPower={powers.esSEAMTokenPower}
              seamDelegatee={powers.seamVotingDelegatee}
              esSEAMDelegatee={powers.esSEAMVotingDelegatee}
              user={address}
              title="Voting power"
            />
          </>
        )}
      </Box>
      <Divider />
      <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          size="large"
          sx={{ width: '100%' }}
          variant="contained"
          disabled={disableButton}
          onClick={() => openGovDelegation()}
        >
          <Trans>Set up delegation</Trans>
        </Button>
        {showRevokeButton && (
          <Button
            size="large"
            sx={{ width: '100%' }}
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
