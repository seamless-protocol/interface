// import { Trans } from '@lingui/macro';
import { Trans } from '@lingui/react';
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import StyledToggleButton from 'src/components/StyledToggleButton';
import StyledToggleButtonGroup from 'src/components/StyledToggleButtonGroup';
// import StyledToggleButton from 'src/components/StyledToggleButton';
// import StyledToggleButtonGroup from 'src/components/StyledToggleButtonGroup';
import { GovDelegationModal } from 'src/components/transactions/GovDelegation/GovDelegationModal';
import { MainLayout } from 'src/layouts/MainLayout';
import { GovernanceTopPanel } from 'src/modules/governance/GovernanceTopPanel';
import { UserGovernanceInfo } from 'src/modules/governance/UserGovernanceInfo';
import { useRootStore } from 'src/store/root';

import { ContentContainer } from '../../src/components/ContentContainer';
import { Ipfs, IpfsType } from '../../src/static-build/ipfs';
import { CustomProposalType, Proposal } from '../../src/static-build/proposal';

export const getStaticProps = async () => {
  const IpfsFetcher = new Ipfs();
  const ProposalFetcher = new Proposal();

  const proposals = [...Array(ProposalFetcher.count()).keys()].map((id) => {
    const ipfs = IpfsFetcher.get(id);
    const proposal = ProposalFetcher.get(id);
    return {
      ipfs: {
        title: ipfs.title,
        id: ipfs.id,
        originalHash: ipfs.originalHash,
        shortDescription: ipfs.shortDescription || '',
      },
      proposal,
      prerendered: true,
    };
  });

  return { props: { proposals: proposals.slice().reverse() } };
};

enum Tabs {
  PROPOSALS,
  INFORMATION,
}
interface GovernancePageProps {
  proposals: {
    ipfs: Pick<IpfsType, 'title' | 'id' | 'originalHash' | 'shortDescription'>;
    proposal: CustomProposalType;
    prerendered: boolean;
  }[];
}

export default function Governance(props: GovernancePageProps) {
  const [queryParams, setQueryParams] = useState({});
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('lg'));
  const [mode, setMode] = useState(Tabs.INFORMATION);
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Governance',
    });
  }, [trackEvent]);
  return (
    <>
      <GovernanceTopPanel />
      <ContentContainer>
        <StyledToggleButtonGroup
          color="primary"
          value={mode}
          exclusive
          onChange={(_, value) => setMode(value)}
          sx={{
            width: { xs: '100%', xsm: '359px' },
            height: '44px',
            mb: 4,
            display: { xs: 'flex', lg: 'none' },
          }}
        >
          <StyledToggleButton value={Tabs.INFORMATION} disabled={mode === Tabs.INFORMATION}>
            <Typography variant="subheader1">
              <Trans id={''}>Your info</Trans>
            </Typography>
          </StyledToggleButton>
        </StyledToggleButtonGroup>
        {isMobile ? (
          <UserGovernanceInfo />
        ) : (
          <Grid container spacing={6}>
            {/* <Grid item md={4}> */}
            <UserGovernanceInfo />
            {/* </Grid> */}
          </Grid>
        )}
      </ContentContainer>
    </>
  );
}

Governance.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <MainLayout>
      {page}
      <GovDelegationModal />
    </MainLayout>
  );
};
