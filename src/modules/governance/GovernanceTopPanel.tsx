import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, Button, SvgIcon, Typography, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { ChainAvailabilityText } from 'src/components/ChainAvailabilityText';
import { Link } from 'src/components/primitives/Link';
import { useRootStore } from 'src/store/root';
import { governanceConfig } from 'src/ui-config/governanceConfig';
import { GENERAL } from 'src/utils/mixPanelEvents';

import Logo from '/public/logo-seamless.svg';

import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';

interface ExternalLinkProps {
  text: string;
  href: string;
}

function ExternalLink({ text, href }: ExternalLinkProps) {
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <Button
      variant="surface"
      size="small"
      sx={{ minWidth: 'unset' }}
      component={Link}
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => trackEvent(GENERAL.EXTERNAL_LINK, { Link: text })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {text}
        <SvgIcon sx={{ ml: 1, fontSize: 14 }}>
          <ExternalLinkIcon />
        </SvgIcon>
      </Box>
    </Button>
  );
}

export const GovernanceTopPanel = () => {
  const theme = useTheme();
  const upToLG = useMediaQuery(theme.breakpoints.up('lg'));
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));

  return (
    <TopInfoPanel
      titleComponent={
        <Box mb={4}>
          <ChainAvailabilityText wrapperSx={{ mb: 4 }} chainId={governanceConfig.chainId} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Logo width="32px" height="32px" alt="" style={{ color: 'white' }} />
            <Typography
              variant={downToXSM ? 'h2' : upToLG ? 'display1' : 'h1'}
              sx={{ ml: 2, mr: 3 }}
            >
              <Trans>Community Governance</Trans>
            </Typography>
          </Box>

          <Typography sx={{ color: '#F1F1F3', maxWidth: '824px' }}>
            <Trans>
              Seamless is a fully decentralized, community governed protocol by the SEAM
              token-holders. SEAM token-holders collectively discuss, propose, and vote on upgrades
              to the protocol. SEAM token-holders (Base network only) can either vote themselves on
              new proposals or delegate to an address of choice.
            </Trans>
          </Typography>
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          maxWidth: 'sm',
        }}
      >
        <ExternalLink text="TALLY" href={governanceConfig.governanceTallyLink} />
        <ExternalLink text="SNAPSHOTS" href={governanceConfig.governanceSnapshotLink} />
        <ExternalLink text="FORUM" href={governanceConfig.governanceForumLink} />
        <ExternalLink text="FAQ" href={governanceConfig.governanceFAQLink} />
      </Box>
    </TopInfoPanel>
  );
};
