import { Box, Button, Container, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { ClaimModal } from 'src/components/Claim/ClaimModal';
import { ConnectWalletPaper } from 'src/components/ConnectWalletPaper';
import { useModalContext } from 'src/hooks/useModal';
import { MainLayout } from 'src/layouts/MainLayout';
import { ClaimTopPanel } from 'src/modules/claim/ClaimTopPanel';

import { useWeb3Context } from '../src/libs/hooks/useWeb3Context';

interface ClaimContainerProps {
  children: ReactNode;
}

export const claimContainerProps = {
  sx: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    pb: '39px',
    px: {
      xs: 2,
      xsm: 5,
      sm: 12,
      md: 5,
      lg: 0,
      xl: '96px',
      xxl: 0,
    },
    maxWidth: {
      xs: 'unset',
      lg: '1240px',
      xl: 'unset',
      xxl: '1440px',
    },
  },
};

export const ClaimContainer = ({ children }: ClaimContainerProps) => {
  return <Container {...claimContainerProps}>{children}</Container>;
};

export default function Staking() {
  const { currentAccount } = useWeb3Context();

  const { openClaim } = useModalContext();

  const handleClaim = () => {
    console.log('handleClaim');
    openClaim('seam', 'SEAM');
  };

  return (
    <>
      {currentAccount.length ? (
        <>
          <ClaimTopPanel />
          <ClaimContainer>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: { xs: '-32px', lg: '-46px', xl: '-44px', xxl: '-48px' },
              }}
            >
              <Box
                sx={{
                  width: '600px',
                  height: '400px',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="img"
                  src="/black_logo_seamless.svg"
                  alt="seam logo"
                  sx={{
                    width: 96,
                    height: 96,
                  }}
                />
                <Box sx={{ maxWidth: '70%', textAlign: 'center' }}>
                  <Typography variant="h1">
                    Claim your <b>SEAM</b> tokens and assign a delegate now!
                  </Typography>
                  <br />
                  <Typography variant="subheader1">
                    Read more about the SEAM tokenomics and governance process <a href="#">here</a>.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 8 }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ height: '44px', width: '128px' }}
                    data-cy="claimButton"
                    onClick={() => handleClaim()}
                  >
                    Claim
                  </Button>
                  <Button
                    variant="contained"
                    disabled={true}
                    size="large"
                    sx={{ height: '44px', width: '128px' }}
                    data-cy="delegateButton"
                  >
                    Delegate
                  </Button>
                </Box>
              </Box>
            </Box>
          </ClaimContainer>
        </>
      ) : (
        <ConnectWalletPaper loading={false} />
      )}
    </>
  );
}

Staking.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <MainLayout>
      {page}
      {/** Modals */}
      <ClaimModal />
      {/** End of modals */}
    </MainLayout>
  );
};
