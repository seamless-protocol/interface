import { Trans } from '@lingui/macro';
import { useMediaQuery, useTheme } from '@mui/material';
import { marketContainerProps } from 'pages/markets.page';
import * as React from 'react';

import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';

export const ClaimTopPanel = () => {
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <TopInfoPanel
      containerProps={marketContainerProps}
      pageTitle={<Trans>Claim SEAM Airdrop</Trans>}
    >
      <TopInfoPanelItem hideIcon title={<Trans>Total market size</Trans>} loading={false}>
        <FormattedNumber
          value={'100000000'}
          symbol="SEAM"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
      <TopInfoPanelItem hideIcon title={<Trans>Your Available Claim</Trans>} loading={false}>
        <FormattedNumber
          value={'10000'}
          symbol="SEAM"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
    </TopInfoPanel>
  );
};
