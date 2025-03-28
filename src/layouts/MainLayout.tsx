import { Box, Container, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import AnalyticsConsent from 'src/components/Analytics/AnalyticsConsent';
import DynamicLifi from 'src/components/LIFI/DynamicLifi';
import { useRootStore } from 'src/store/root';
import { FORK_ENABLED } from 'src/utils/marketsAndNetworksConfig';
import { Warning } from 'src/components/primitives/Warning';
import { Trans } from '@lingui/macro';
import { Link } from 'src/components/primitives/Link';

import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';

export function MainLayout({ children }: { children: ReactNode }) {
  const isLifiWidgetOpen = useRootStore((state) => state.isLifiWidgetOpen);
  return (
    <>
      <AppHeader />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {isLifiWidgetOpen && <DynamicLifi />}
        <Box
          sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', margin: 0, width: '100%', padding: 0, bgcolor: 'background.header'
          }}
        >
          <Container sx={{ padding: 0, margin: 0}}>
            <Warning severity='warning' sx={{ mb: 0, width: '100%' }}>
              <Typography variant="subheader1">
                <Trans>Legacy Platform Sunset</Trans>
              </Typography>
              <Typography>
                <Trans>
                  The legacy platform will be sunsetting on April 14th, 2025. New deposits and borrows will be disabled. We encourage you to migrate to Seamless Vaults on Morpho. More details{" "}
                  <Link href="https://discord.com/channels/1037820309400731769/1037836076875788419/1355232743541182566">HERE</Link>.
                </Trans>
              </Typography>
            </Warning>
          </Container>
        </Box>


        {children}
      </Box>

      <AppFooter />
      {FORK_ENABLED ? null : <AnalyticsConsent />}
    </>
  );
}
