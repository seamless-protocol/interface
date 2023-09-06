import { ChainId } from '@aave/contract-helpers';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, Button, SvgIcon, Typography, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { ChainAvailabilityText } from 'src/components/ChainAvailabilityText';
import { Link } from 'src/components/primitives/Link';
import { useRootStore } from 'src/store/root';
import { GENERAL } from 'src/utils/mixPanelEvents';

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
          <ChainAvailabilityText wrapperSx={{ mb: 4 }} chainId={ChainId.mainnet} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <img
              src={`/logo_seamless.svg`}
              width="32px"
              height="32px"
              alt=""
              style={{ color: 'white' }}
            />
            <Typography
              variant={downToXSM ? 'h2' : upToLG ? 'display1' : 'h1'}
              sx={{ ml: 2, mr: 3 }}
            >
              <Trans>Community Governance</Trans>
            </Typography>
          </Box>

          <Typography sx={{ color: '#8E92A3', maxWidth: '824px' }}>
            <Trans>
              Seamless is a fully decentralized, community governed protocol by the OG Points
              token-holders. OG Points token-holders collectively discuss, propose, and vote on
              upgrades to the protocol. OG Points token-holders (Ethereum network only) can either
              vote themselves on new proposals or delagate to an address of choice.
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
        <ExternalLink text="SNAPSHOTS" href="" />
        <ExternalLink text="FORUM" href="" />
        <ExternalLink text="FAQ" href="" />
      </Box>
    </TopInfoPanel>
  );
};
