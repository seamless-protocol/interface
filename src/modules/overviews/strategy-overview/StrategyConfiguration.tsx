import { Trans } from '@lingui/macro';
import { Box, Divider } from '@mui/material';
import { getFrozenProposalLink } from 'src/components/infoTooltips/FrozenTooltip';
import { Link } from 'src/components/primitives/Link';
import { Warning } from 'src/components/primitives/Warning';
import { AMPLWarning } from 'src/components/Warnings/AMPLWarning';
import { BorrowDisabledWarning } from 'src/components/Warnings/BorrowDisabledWarning';
import { BUSDOffBoardingWarning } from 'src/components/Warnings/BUSDOffBoardingWarning';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { BROKEN_ASSETS } from 'src/hooks/useReservesHistory';

import { PanelRow, PanelTitle } from '../ReservePanels';
import { SupplyInfo } from '../SupplyInfo';

type StrategyConfigurationProps = {
  reserve: ComputedReserveData;
};

export const StrategyConfiguration: React.FC<StrategyConfigurationProps> = ({ reserve }) => {
  const { currentNetworkConfig, currentMarketData, currentMarket } = useProtocolDataContext();
  const reserveId =
    reserve.underlyingAsset + currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER;
  const renderCharts =
    !!currentNetworkConfig.ratesHistoryApiUrl &&
    !currentMarketData.disableCharts &&
    !BROKEN_ASSETS.includes(reserveId);
  const { supplyCap, debtCeiling } = useAssetCaps();
  const showSupplyCapStatus: boolean = reserve.supplyCap !== '0';

  return (
    <>
      <Box>
        {reserve.isFrozen && reserve.symbol != 'BUSD' ? (
          <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
            <Trans>
              This asset is frozen due to an community decision.{' '}
              <Link
                href={getFrozenProposalLink(reserve.symbol, currentMarket)}
                sx={{ textDecoration: 'underline' }}
              >
                <Trans>More details</Trans>
              </Link>
            </Trans>
          </Warning>
        ) : reserve.symbol === 'BUSD' ? (
          <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
            <BUSDOffBoardingWarning />
          </Warning>
        ) : (
          reserve.symbol == 'AMPL' && (
            <Warning sx={{ mt: '16px', mb: '40px' }} severity="warning">
              <AMPLWarning />
            </Warning>
          )
        )}

        {reserve.isPaused ? (
          <Warning sx={{ mt: '16px', mb: '40px' }} severity="error">
            <Trans>
              MAI has been paused due to a community decision. Supply, borrows and repays are
              impacted.{' '}
              <Link
                href={
                  'https://governance.aave.com/t/arfc-add-mai-to-arbitrum-aave-v3-market/12759/8'
                }
                sx={{ textDecoration: 'underline' }}
              >
                <Trans>More details</Trans>
              </Link>
            </Trans>
          </Warning>
        ) : null}
      </Box>

      <PanelRow>
        <PanelTitle>Loop Info</PanelTitle>
        <SupplyInfo
          reserve={reserve}
          currentMarketData={currentMarketData}
          renderCharts={renderCharts}
          showSupplyCapStatus={showSupplyCapStatus}
          supplyCap={supplyCap}
          debtCeiling={debtCeiling}
        />
      </PanelRow>

      <Divider sx={{ my: { xs: 6, sm: 10 } }} />

      <PanelRow>
        <PanelTitle>Loop Description</PanelTitle>
        <Box sx={{ flexGrow: 1, minWidth: 0, maxWidth: '100%', width: '100%' }}>
          {!reserve.borrowingEnabled && (
            <Warning sx={{ mb: '40px' }} severity="error">
              <BorrowDisabledWarning symbol={reserve.symbol} currentMarket={currentMarket} />
            </Warning>
          )}
          This Integrated Liquidity Market uses {reserve.symbol} deposits to borrow stablecoins,
          which purchase more {reserve.symbol} to achieve the targeted multiple.
        </Box>
      </PanelRow>
    </>
  );
};
