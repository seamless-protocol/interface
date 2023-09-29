import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, Button, Skeleton, SvgIcon, Typography, useMediaQuery, useTheme } from '@mui/material';
import { CircleIcon } from 'src/components/CircleIcon';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link, ROUTES } from 'src/components/primitives/Link';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';
import { GENERAL, RESERVE_DETAILS } from 'src/utils/mixPanelEvents';

import { TopInfoPanelItem } from '../../../components/TopInfoPanel/TopInfoPanelItem';
import {
  ComputedReserveData,
  useAppDataContext,
} from '../../../hooks/app-data-provider/useAppDataProvider';

interface StrategyTopDetailsProps {
  underlyingAsset: string;
}

export const StrategyTopDetails = ({ underlyingAsset }: StrategyTopDetailsProps) => {
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
      <Button
        variant="outlined"
        component={Link}
        href={ROUTES.reserveOverview(poolReserve.underlyingAsset, currentMarket)}
        onClick={() =>
          trackEvent(RESERVE_DETAILS.SWAP_VIEWS, {
            type: 'Button',
            assetName: poolReserve.name,
            asset: poolReserve.underlyingAsset,
            market: currentMarket,
          })
        }
        sx={(theme) => ({
          mt: 1,
          backgroundColor: theme.palette.background.surface,
          color: theme.palette.text.links,
          '&:hover': {
            backgroundColor: theme.palette.background.surface,
            color: theme.palette.text.links,
          },
        })}
      >
        <Trans>Asset View</Trans>
      </Button>
      <TopInfoPanelItem title={<Trans>Target Multiple</Trans>} loading={loading} hideIcon>
        <Typography
          variant={valueTypographyVariant}
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
          }}
          noWrap
        >
          3x
        </Typography>
      </TopInfoPanelItem>

      <TopInfoPanelItem title={<Trans>Estimated Net APY</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={Math.max(Number(poolReserve?.totalLiquidityUSD), 0)}
          symbol="USD"
          percent
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#A5A8B6"
        />
      </TopInfoPanelItem>
      {/*TODO seamless pipein values*/}
      <TopInfoPanelItem title={<Trans>Space Available</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={Math.max(Number(poolReserve?.availableLiquidityUSD), 0)}
          symbol={poolReserve?.symbol}
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
    </>
  );
};
