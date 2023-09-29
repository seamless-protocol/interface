import { Trans } from '@lingui/macro';
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { StableAPYTooltip } from 'src/components/infoTooltips/StableAPYTooltip';
import { VariableAPYTooltip } from 'src/components/infoTooltips/VariableAPYTooltip';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';

import { AssetsListItemLoader } from '../AssetsListItemLoader';
import { AssetsListMobileItemLoader } from '../AssetsListMobileItemLoader';
import { StrategyAssetsListItem } from './StrategyAssetsListItem';
import { StrategyAssetsListMobileItem } from './StrategyAssetsListMobileItem';

const listHeaders = [
  {
    title: <Trans>Asset</Trans>,
    sortKey: 'symbol',
  },
  {
    title: <Trans>Space Available</Trans>,
    sortKey: 'spaceAvailable',
  },
  {
    title: <Trans>Description</Trans>,
    sortKey: 'description',
  },
  {
    title: <Trans>Target Multiple</Trans>,
    sortKey: 'targetMultiple',
  },
  {
    title: (
      <VariableAPYTooltip
        text={<Trans>Estimated Net APY</Trans>}
        key="APY_list_variable_type"
        variant="subheader2"
      />
    ),
    sortKey: 'variableBorrowAPY',
  },
  {
    title: (
      <StableAPYTooltip
        text={<Trans>Your Position</Trans>}
        key="APY_list_stable_type"
        variant="subheader2"
      />
    ),
    sortKey: 'stableBorrowAPY',
  },
];

type StrategyAssetsListProps = {
  reserves: ComputedReserveData[];
  loading: boolean;
};

export default function StrategyAssetsList({ reserves, loading }: StrategyAssetsListProps) {
  const isTableChangedToCards = useMediaQuery('(max-width:1125px)');
  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);

  if (sortDesc) {
    if (sortName === 'symbol') {
      reserves.sort((a, b) => (a.symbol.toUpperCase() < b.symbol.toUpperCase() ? -1 : 1));
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reserves.sort((a, b) => a[sortName] - b[sortName]);
    }
  } else {
    if (sortName === 'symbol') {
      reserves.sort((a, b) => (b.symbol.toUpperCase() < a.symbol.toUpperCase() ? -1 : 1));
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reserves.sort((a, b) => b[sortName] - a[sortName]);
    }
  }

  // Show loading state when loading
  if (loading) {
    return isTableChangedToCards ? (
      <>
        <AssetsListMobileItemLoader />
        <AssetsListMobileItemLoader />
        <AssetsListMobileItemLoader />
      </>
    ) : (
      <>
        <AssetsListItemLoader />
        <AssetsListItemLoader />
        <AssetsListItemLoader />
      </>
    );
  }

  // Hide list when no results, via search term or if a market has all/no frozen/unfrozen assets
  if (reserves.length === 0) return null;

  return (
    <>
      {!isTableChangedToCards && (
        <ListHeaderWrapper px={6}>
          {listHeaders.map((col) => (
            <ListColumn
              isRow={col.sortKey === 'symbol'}
              maxWidth={col.sortKey === 'symbol' ? 280 : undefined}
              key={col.sortKey}
            >
              <ListHeaderTitle
                sortName={sortName}
                sortDesc={sortDesc}
                setSortName={setSortName}
                setSortDesc={setSortDesc}
                sortKey={col.sortKey}
                source="Markets Page"
              >
                {col.title}
              </ListHeaderTitle>
            </ListColumn>
          ))}
          <ListColumn maxWidth={95} minWidth={95} />
        </ListHeaderWrapper>
      )}

      {reserves.map((reserve) =>
        isTableChangedToCards ? (
          <StrategyAssetsListMobileItem {...reserve} key={reserve.id} />
        ) : (
          <StrategyAssetsListItem {...reserve} key={reserve.id} />
        )
      )}
    </>
  );
}
