import { Box } from '@mui/material';
import { useState } from 'react';

const Banner = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      {showBanner ? (
        <Box
          sx={(theme) => ({
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            justifyItems: 'center',
            color: 'black',
            backgroundColor: theme.palette.background.banner,
          })}
        >
          <Box
            sx={{
              width: '75%',
              textAlign: 'center',
              fontSize: { xs: '10px', md: '14px' },
              display: 'flex',
            }}
          >
            <p>
              <b>Staking Farms will be temporarily inactive starting November 8th.</b> If your are
              currently using the Staking Farms, you will need to unstake and withdraw your position
              on November 8th to continue earning OG points. Learn more about how to
              unstake/withdraw{' '}
              <a
                href="https://seamlessprotocol.medium.com/unstaking-withdrawing-on-seamless-protocol-a-step-by-step-guide-e25e72d2b73b"
                target="_blank"
                rel="noopener noreferrer"
              >
                <b>here</b>
              </a>
              .
            </p>
          </Box>
          <Box
            component="img"
            src="/close.svg"
            alt="close banner icon"
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              height: '20px',
              width: '20px',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={() => setShowBanner(false)}
          />
        </Box>
      ) : null}
    </>
  );
};

export default Banner;
