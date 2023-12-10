// import { Trans } from '@lingui/macro';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
// import StyledToggleButton from 'src/components/StyledToggleButton';
// import StyledToggleButtonGroup from 'src/components/StyledToggleButtonGroup';
import { GovDelegationModal } from 'src/components/transactions/GovDelegation/GovDelegationModal';
import { GovVoteModal } from 'src/components/transactions/GovVote/GovVoteModal';
import { useModalContext } from 'src/hooks/useModal';
import { MainLayout } from 'src/layouts/MainLayout';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { GovernanceTopPanel } from 'src/modules/governance/GovernanceTopPanel';
import { UserGovernanceInfo } from 'src/modules/governance/UserGovernanceInfo';
//import { Ipfs, IpfsType } from 'src/static-build/ipfs';
//import { CustomProposalType, Proposal } from 'src/static-build/proposal';
import { useRootStore } from 'src/store/root';

import { ContentContainer } from '../../src/components/ContentContainer';

// export const getStaticProps = async () => {
//   const IpfsFetcher = new Ipfs();
//   const ProposalFetcher = new Proposal();

//   const proposals = [...Array(ProposalFetcher.count()).keys()].map((id) => {
//     const ipfs = IpfsFetcher.get(id);
//     const proposal = ProposalFetcher.get(id);
//     return {
//       ipfs: {
//         title: ipfs.title,
//         id: ipfs.id,
//         originalHash: ipfs.originalHash,
//         shortDescription: ipfs.shortDescription || '',
//       },
//       proposal,
//       prerendered: true,
//     };
//   });

//   return { props: { proposals: proposals.slice().reverse() } };
// };

// enum Tabs {
//   PROPOSALS,
//   INFORMATION,
// }

// export type GovernancePageProps = {
//   proposals: {
//     ipfs: Pick<IpfsType, 'title' | 'id' | 'originalHash' | 'shortDescription'>;
//     proposal: CustomProposalType;
//     prerendered: boolean;
//   }[];
// };

export default function Governance(/*props: GovernancePageProps*/) {
  // const { breakpoints } = useTheme();
  // const isMobile = useMediaQuery(breakpoints.down('lg'));
  // const [mode, setMode] = useState(Tabs.INFORMATION);
  const { query } = useRouter();
  const { openGovVote } = useModalContext();
  const { connected } = useWeb3Context();

  const governorAddressQuery =
    query['governorAddress'] === undefined || Array.isArray(query['governorAddress'])
      ? ''
      : (query['governorAddress'] as string).toLocaleLowerCase();
  const proposalIdQuery =
    query['proposalId'] === undefined || Array.isArray(query['proposalId'])
      ? ''
      : query['proposalId'];
  
  useEffect(() => {
    console.log("connected: ", connected, ", proposalIdQuery: ", proposalIdQuery, ", governorAddressQuery: ", governorAddressQuery);
    if (
      connected &&
      proposalIdQuery &&
      proposalIdQuery !== '' &&
      governorAddressQuery &&
      governorAddressQuery !== ''
    ) {
      openGovVote();
    }
  }, [connected, proposalIdQuery, governorAddressQuery]);

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
        {/* <StyledToggleButtonGroup
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
              <Trans>Your info</Trans>
            </Typography>
          </StyledToggleButton>
        </StyledToggleButtonGroup>
        {isMobile ? (
          <UserGovernanceInfo />
        ) : ( */}
        <Grid container spacing={6}>
          {/* <Grid item md={4}> */}
          <UserGovernanceInfo />
          {/* </Grid> */}
        </Grid>
        {/* )} */}
      </ContentContainer>
    </>
  );
}

Governance.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <MainLayout>
      {page}
      <GovDelegationModal />
      <GovVoteModal />
    </MainLayout>
  );
};
