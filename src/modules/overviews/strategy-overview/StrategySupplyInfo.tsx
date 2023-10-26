import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import { CapsCircularStatus } from 'src/components/caps/CapsCircularStatus';
import { IncentivesButton } from 'src/components/incentives/IncentivesButton';
import { LiquidationThresholdTooltip } from 'src/components/infoTooltips/LiquidationThresholdTooltip';
import { MaxLTVTooltip } from 'src/components/infoTooltips/MaxLTVTooltip';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { ReserveOverviewBox } from 'src/components/ReserveOverviewBox';
import { ReserveSubheader } from 'src/components/ReserveSubheader';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { AssetCapHookData } from 'src/hooks/useAssetCaps';
import { MarketDataType } from 'src/utils/marketsAndNetworksConfig';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { ApyGraphContainer } from '../graphs/ApyGraphContainer';
import { PanelItem } from '../ReservePanels';

interface StrategySupplyInfoProps {
  reserve: ComputedReserveData;
  currentMarketData: MarketDataType;
  renderCharts: boolean;
  showSupplyCapStatus: boolean;
  supplyCap: AssetCapHookData;
  debtCeiling: AssetCapHookData;
}

export const StrategySupplyInfo = ({
  reserve,
  currentMarketData,
  renderCharts,
  showSupplyCapStatus,
  supplyCap,
}: StrategySupplyInfoProps) => {
  return (
    <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: '100%', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {showSupplyCapStatus ? (
          // With supply cap
          <>
            <CapsCircularStatus
              value={supplyCap.percentUsed}
              tooltipContent={
                <>
                  <Trans>
                    Maximum amount available to supply is{' '}
                    <FormattedNumber
                      value={
                        valueToBigNumber(reserve.supplyCap).toNumber() -
                        valueToBigNumber(reserve.totalLiquidity).toNumber()
                      }
                      variant="secondary12"
                    />{' '}
                    {reserve.symbol} (
                    <FormattedNumber
                      value={
                        valueToBigNumber(reserve.supplyCapUSD).toNumber() -
                        valueToBigNumber(reserve.totalLiquidityUSD).toNumber()
                      }
                      variant="secondary12"
                      symbol="USD"
                    />
                    ).
                  </Trans>
                </>
              }
            />
            <PanelItem
              title={
                <Box display="flex" alignItems="center">
                  <Trans>Total deposited</Trans>
                  <TextWithTooltip
                    event={{
                      eventName: GENERAL.TOOL_TIP,
                      eventParams: {
                        tooltip: 'Total Supply',
                        asset: reserve.underlyingAsset,
                        assetName: reserve.name,
                      },
                    }}
                  >
                    <>
                      <Trans>
                        Asset supply is limited to a certain amount to reduce protocol exposure to
                        the asset and to help manage risks involved.
                      </Trans>
                    </>
                  </TextWithTooltip>
                </Box>
              }
            >
              <Box>
                <FormattedNumber value={reserve.totalLiquidity} variant="main16" compact />
                <Typography
                  component="span"
                  color="text.primary"
                  variant="secondary16"
                  sx={{ display: 'inline-block', mx: 1 }}
                >
                  <Trans>of</Trans>
                </Typography>
                <FormattedNumber value={reserve.supplyCap} variant="main16" />
              </Box>
              <Box>
                <ReserveSubheader value={reserve.totalLiquidityUSD} />
                <Typography
                  component="span"
                  color="text.secondary"
                  variant="secondary12"
                  sx={{ display: 'inline-block', mx: 1 }}
                >
                  <Trans>of</Trans>
                </Typography>
                <ReserveSubheader value={reserve.supplyCapUSD} />
              </Box>
            </PanelItem>
          </>
        ) : (
          // Without supply cap
          <PanelItem
            title={
              <Box display="flex" alignItems="center">
                <Trans>Total supplied</Trans>
              </Box>
            }
          >
            <FormattedNumber value={reserve.totalLiquidity} variant="main16" compact />
            <ReserveSubheader value={reserve.totalLiquidityUSD} />
          </PanelItem>
        )}
        <PanelItem title={<Trans>APY</Trans>}>
          <FormattedNumber value={reserve.supplyAPY} percent variant="main16" />
          <IncentivesButton
            symbol={reserve.symbol}
            incentives={reserve.aIncentivesData}
            displayBlank={true}
          />
        </PanelItem>
        {reserve.unbacked && reserve.unbacked !== '0' && (
          <PanelItem title={<Trans>Unbacked</Trans>}>
            <FormattedNumber value={reserve.unbacked} variant="main16" symbol={reserve.name} />
            <ReserveSubheader value={reserve.unbackedUSD} />
          </PanelItem>
        )}
      </Box>
      {renderCharts && (reserve.borrowingEnabled || Number(reserve.totalDebt) > 0) && (
        <ApyGraphContainer
          graphKey="supply"
          reserve={reserve}
          currentMarketData={currentMarketData}
        />
      )}

      <div>
        <Box sx={{ pt: '42px', pb: '12px' }}>
          <Typography variant="subheader1" color="text.main" paddingBottom={'12px'}>
            <Trans>Loan to Value (LTV)*</Trans>
          </Typography>
        </Box>
      </div>
      {reserve.reserveLiquidationThreshold !== '0' && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
          }}
        >
          <ReserveOverviewBox
            title={
              <MaxLTVTooltip
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'Target LTV',
                    asset: reserve.underlyingAsset,
                    assetName: reserve.name,
                  },
                }}
                variant="description"
                text={<Trans>Target Multiple</Trans>}
                sx={{ fontSize: '10px' }}
              />
            }
          >
            300%
          </ReserveOverviewBox>

          <ReserveOverviewBox
            title={
              <LiquidationThresholdTooltip
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'Current LTV',
                    asset: reserve.underlyingAsset,
                    assetName: reserve.name,
                  },
                }}
                variant="description"
                text={<Trans>Current multiple</Trans>}
                sx={{ fontSize: '10px' }}
              />
            }
          >
            317%
          </ReserveOverviewBox>

          <ReserveOverviewBox
            title={
              <LiquidationThresholdTooltip
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'Max Multiple before Rebalance',
                    asset: reserve.underlyingAsset,
                    assetName: reserve.name,
                  },
                }}
                variant="description"
                text={<Trans>Max LTV before Rebalance</Trans>}
                sx={{ fontSize: '10px' }}
              />
            }
          >
            400%
          </ReserveOverviewBox>

          <ReserveOverviewBox
            title={
              <MaxLTVTooltip
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'Target Multiple',
                    asset: reserve.underlyingAsset,
                    assetName: reserve.name,
                  },
                }}
                variant="description"
                text={<Trans>Target Multiple</Trans>}
                sx={{ fontSize: '10px' }}
              />
            }
          >
            3.0x
          </ReserveOverviewBox>

          <ReserveOverviewBox
            title={
              <LiquidationThresholdTooltip
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'Max Multiple before Rebalance',
                    asset: reserve.underlyingAsset,
                    assetName: reserve.name,
                  },
                }}
                variant="description"
                text={<Trans>Current multiple</Trans>}
                sx={{ fontSize: '10px' }}
              />
            }
          >
            3.17x
          </ReserveOverviewBox>

          <ReserveOverviewBox
            title={
              <LiquidationThresholdTooltip
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'Max Multiple before Rebalance',
                    asset: reserve.underlyingAsset,
                    assetName: reserve.name,
                  },
                }}
                variant="description"
                text={<Trans>Max Multiple before Rebalance</Trans>}
                sx={{ fontSize: '10px' }}
              />
            }
          >
            4.0x
          </ReserveOverviewBox>
        </Box>
      )}
    </Box>
  );
};
