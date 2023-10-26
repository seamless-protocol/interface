import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, Button, Divider, Skeleton, SvgIcon, useMediaQuery, useTheme } from '@mui/material';
import { CircleIcon } from 'src/components/CircleIcon';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link, ROUTES } from 'src/components/primitives/Link';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';
import { IsAllowListedForILM } from 'src/utils/ILMConfig';
import { GENERAL, RESERVE_DETAILS } from 'src/utils/mixPanelEvents';

import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import {
  ComputedReserveData,
  useAppDataContext,
} from '../../hooks/app-data-provider/useAppDataProvider';

interface ReserveTopDetailsProps {
  underlyingAsset: string;
}

export const ReserveTopDetails = ({ underlyingAsset }: ReserveTopDetailsProps) => {
  const { reserves, loading } = useAppDataContext();
  const { currentNetworkConfig, currentMarket } = useProtocolDataContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const poolReserve = reserves.find(
    (reserve) => reserve.underlyingAsset === underlyingAsset
  ) as ComputedReserveData;

  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsTypographyVariant = downToSM ? 'secondary16' : 'secondary21';

  const iconStyling = {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#A5A8B6',
    '&:hover': { color: '#F1F1F3' },
    cursor: 'pointer',
  };

  return (
    <>
      <TopInfoPanelItem title={<Trans>Reserve Size</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={Math.max(Number(poolReserve?.totalLiquidityUSD), 0)}
          symbol="USD"
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#A5A8B6"
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem title={<Trans>Available liquidity</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={Math.max(Number(poolReserve?.availableLiquidityUSD), 0)}
          symbol="USD"
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#A5A8B6"
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem title={<Trans>Utilization Rate</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={poolReserve?.borrowUsageRatio}
          percent
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#A5A8B6"
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem title={<Trans>Oracle price</Trans>} loading={loading} hideIcon>
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <FormattedNumber
            value={poolReserve?.priceInUSD}
            symbol="USD"
            variant={valueTypographyVariant}
            symbolsVariant={symbolsTypographyVariant}
            symbolsColor="#A5A8B6"
          />
          {loading ? (
            <Skeleton width={16} height={16} sx={{ ml: 1, background: '#383D51' }} />
          ) : (
            <CircleIcon tooltipText="View oracle contract" downToSM={downToSM}>
              <Link
                onClick={() =>
                  trackEvent(GENERAL.EXTERNAL_LINK, {
                    Link: 'Oracle Price',
                    oracle: poolReserve?.priceOracle,
                    assetName: poolReserve.name,
                    asset: poolReserve.underlyingAsset,
                  })
                }
                href={currentNetworkConfig.explorerLinkBuilder({
                  address: poolReserve?.priceOracle,
                })}
                sx={iconStyling}
              >
                <SvgIcon sx={{ fontSize: downToSM ? '12px' : '14px' }}>
                  <ExternalLinkIcon />
                </SvgIcon>
              </Link>
            </CircleIcon>
          )}
        </Box>
      </TopInfoPanelItem>
      {IsAllowListedForILM(poolReserve.underlyingAsset) && (
        <>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ my: 1, borderColor: 'rgba(235, 235, 239, 0.08)' }}
          />
          <Button
            variant="outlined"
            component={Link}
            href={ROUTES.strategyOverview(poolReserve.underlyingAsset, currentMarket)}
            onClick={() =>
              trackEvent(RESERVE_DETAILS.SWAP_VIEWS, {
                type: 'Button',
                assetName: poolReserve.name,
                asset: poolReserve.underlyingAsset,
                market: currentMarket,
              })
            }
            sx={(theme) => ({
              textAlign: 'center',
              mt: -2,
              backgroundColor: '#690d64',
              color: theme.palette.text.links,
              '&:hover': {
                backgroundColor: '#690d64',
                color: theme.palette.text.links,
              },
            })}
          >
            <Trans>
              Switch to the
              <br />
              Looping Strategy
            </Trans>
          </Button>
        </>
      )}
    </>
  );
};
