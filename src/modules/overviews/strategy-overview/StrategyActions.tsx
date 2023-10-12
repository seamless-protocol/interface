import { API_ETH_MOCK_ADDRESS, InterestRate } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import React, { ReactNode, useState } from 'react';
import { WalletIcon } from 'src/components/icons/WalletIcon';
import { getMarketInfoById } from 'src/components/MarketSwitcher';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Warning } from 'src/components/primitives/Warning';
import { StyledTxModalToggleButton } from 'src/components/StyledToggleButton';
import { StyledTxModalToggleGroup } from 'src/components/StyledToggleButtonGroup';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import {
  ComputedReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';
import { useModalContext } from 'src/hooks/useModal';
import { usePermissions } from 'src/hooks/usePermissions';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { BuyWithFiat } from 'src/modules/staking/BuyWithFiat';
import { useRootStore } from 'src/store/root';
import { getMaxAmountAvailableToBorrow } from 'src/utils/getMaxAmountAvailableToBorrow';
import { getMaxAmountAvailableToSupply } from 'src/utils/getMaxAmountAvailableToSupply';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { CapType } from '../../../components/caps/helper';
import { AvailableTooltip } from '../../../components/infoTooltips/AvailableTooltip';
import { Link, ROUTES } from '../../../components/primitives/Link';
import { useReserveActionState } from '../../../hooks/useReserveActionState';

interface StrategyActionsProps {
  reserve: ComputedReserveData;
}

export const StrategyActions = ({ reserve }: StrategyActionsProps) => {
  const [selectedAsset, setSelectedAsset] = useState<string>(reserve.symbol);

  const { currentAccount, loading: loadingWeb3Context } = useWeb3Context();
  const { isPermissionsLoading } = usePermissions();
  const { openLoop } = useModalContext();
  const { currentMarket, currentNetworkConfig } = useProtocolDataContext();
  const { user, loading: loadingReserves } = useAppDataContext();
  const { walletBalances, loading: loadingWalletBalance } = useWalletBalances();

  const [minRemainingBaseTokenBalance] = useRootStore((store) => [
    store.poolComputed.minRemainingBaseTokenBalance,
  ]);
  const { baseAssetSymbol } = currentNetworkConfig;
  let balance = walletBalances[reserve.underlyingAsset];
  if (reserve.isWrappedBaseAsset && selectedAsset === baseAssetSymbol) {
    balance = walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()];
  }

  let maxAmountToBorrow = '0';
  let maxAmountToSupply = '0';

  maxAmountToBorrow = getMaxAmountAvailableToBorrow(
    reserve,
    user,
    InterestRate.Variable
  ).toString();

  maxAmountToSupply = getMaxAmountAvailableToSupply(
    balance?.amount || '0',
    reserve,
    reserve.underlyingAsset,
    minRemainingBaseTokenBalance
  ).toString();

  const { disableBorrowButton, alerts } = useReserveActionState({
    balance: balance?.amount || '0',
    maxAmountToSupply: maxAmountToSupply.toString(),
    maxAmountToBorrow: maxAmountToBorrow.toString(),
    reserve,
  });

  if (!currentAccount && !isPermissionsLoading) {
    return <ConnectWallet loading={loadingWeb3Context} />;
  }

  if (loadingReserves || loadingWalletBalance) {
    return <ActionsSkeleton />;
  }

  const { market } = getMarketInfoById(currentMarket);

  return (
    <PaperWrapper>
      {reserve.isWrappedBaseAsset && (
        <Box>
          <WrappedBaseAssetSelector
            assetSymbol={reserve.symbol}
            baseAssetSymbol={baseAssetSymbol}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
          />
        </Box>
      )}
      <WalletBalance
        balance={balance.amount}
        symbol={selectedAsset}
        marketTitle={market.marketTitle}
      />
      {reserve.isFrozen || reserve.isPaused ? (
        <Box sx={{ mt: 3 }}>{reserve.isPaused ? <PauseWarning /> : <FrozenWarning />}</Box>
      ) : (
        <>
          <Divider sx={{ my: 6 }} />
          <Stack gap={3}>
            {reserve.borrowingEnabled && (
              <LoopAction
                reserve={reserve}
                value={balance.amount.toString()}
                usdValue={balance.amountUSD.toString()}
                symbol={selectedAsset}
                disable={disableBorrowButton}
                onActionClicked={() => {
                  openLoop(reserve.underlyingAsset, currentMarket, reserve.name, 'reserve', true);
                }}
              />
            )}
            {alerts}
          </Stack>
        </>
      )}
    </PaperWrapper>
  );
};

const PauseWarning = () => {
  return (
    <Warning sx={{ mb: 0 }} severity="error" icon={true}>
      <Trans>Because this asset is paused, no actions can be taken until further notice</Trans>
    </Warning>
  );
};

const FrozenWarning = () => {
  return (
    <Warning sx={{ mb: 0 }} severity="error" icon={true}>
      <Trans>
        Since this asset is frozen, the only available actions are withdraw and repay which can be
        accessed from the <Link href={ROUTES.dashboard}>Dashboard</Link>
      </Trans>
    </Warning>
  );
};

const ActionsSkeleton = () => {
  const RowSkeleton = (
    <Stack>
      <Skeleton width={150} height={14} />
      <Stack
        sx={{ height: '44px' }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Skeleton width={100} height={14} sx={{ mt: 1, mb: 2 }} />
          <Skeleton width={75} height={12} />
        </Box>
        <Skeleton height={36} width={96} />
      </Stack>
    </Stack>
  );

  return (
    <PaperWrapper>
      <Stack direction="row" gap={3}>
        <Skeleton width={42} height={42} sx={{ borderRadius: '12px' }} />
        <Box>
          <Skeleton width={100} height={12} sx={{ mt: 1, mb: 2 }} />
          <Skeleton width={100} height={14} />
        </Box>
      </Stack>
      <Divider sx={{ my: 6 }} />
      <Box>
        <Stack gap={3}>
          {RowSkeleton}
          {RowSkeleton}
        </Stack>
      </Box>
    </PaperWrapper>
  );
};

const PaperWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Paper sx={{ pt: 4, pb: { xs: 4, xsm: 6 }, px: { xs: 4, xsm: 6 } }}>
      <Typography variant="h3" sx={{ mb: 6 }}>
        <Trans>Your info</Trans>
      </Typography>

      {children}
    </Paper>
  );
};

const ConnectWallet = ({ loading }: { loading: boolean }) => {
  return (
    <Paper sx={{ pt: 4, pb: { xs: 4, xsm: 6 }, px: { xs: 4, xsm: 6 } }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h3" sx={{ mb: { xs: 6, xsm: 10 } }}>
            <Trans>Your info</Trans>
          </Typography>
          <Typography sx={{ mb: 6 }} color="text.secondary">
            <Trans>Please connect a wallet to view your personal information here.</Trans>
          </Typography>
          <ConnectWalletButton />
        </>
      )}
    </Paper>
  );
};

interface ActionProps {
  value: string;
  usdValue: string;
  symbol: string;
  disable: boolean;
  onActionClicked: () => void;
  reserve: ComputedReserveData;
}

const LoopAction = ({
  reserve,
  value,
  usdValue,
  symbol,
  disable,
  onActionClicked,
}: ActionProps) => {
  return (
    <Stack>
      <Grid container columns={2} columnSpacing={12} marginBottom={2}>
        <Grid item marginBottom={4} sx={{ width: '175px' }}>
          <AvailableTooltip
            variant="description"
            text={<Trans>Current Multiple</Trans>}
            capType={CapType.borrowCap}
            event={{
              eventName: GENERAL.TOOL_TIP,
              eventParams: {
                tooltip: 'Current Multiple: your info',
                asset: reserve.underlyingAsset,
                assetName: reserve.name,
              },
            }}
          />
          <Stack
            sx={{ height: '44px' }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <ValueWithSymbol value={'3'} symbol={'x'} />
              {/* <FormattedNumber
                value={usdValue}
                variant="subheader2"
                color="text.muted"
                symbolsColor="text.muted"
                symbol="USD"
              /> */}
            </Box>
          </Stack>
        </Grid>

        <Grid item>
          <AvailableTooltip
            variant="description"
            text={<Trans>{reserve.name} APY</Trans>}
            capType={CapType.borrowCap}
            event={{
              eventName: GENERAL.TOOL_TIP,
              eventParams: {
                tooltip: 'cbETH: your info',
                asset: reserve.underlyingAsset,
                assetName: reserve.name,
              },
            }}
          />
          <Stack
            sx={{ height: '44px' }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <ValueWithSymbol value={value} symbol={'%'} />
            </Box>
          </Stack>
        </Grid>

        <Grid item sx={{ width: '175px' }}>
          <AvailableTooltip
            variant="description"
            text={<Trans>Your Balance</Trans>}
            capType={CapType.borrowCap}
            event={{
              eventName: GENERAL.TOOL_TIP,
              eventParams: {
                tooltip: 'Your balance: your info',
                asset: reserve.underlyingAsset,
                assetName: reserve.name,
              },
            }}
          />
          <Stack
            sx={{ height: '44px' }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <ValueWithSymbol value={(Number(value) * 3).toLocaleString()} symbol={symbol} />
            </Box>
          </Stack>
        </Grid>

        <Grid item>
          <AvailableTooltip
            variant="description"
            text={<Trans>Your Total Exposure</Trans>}
            capType={CapType.borrowCap}
            event={{
              eventName: GENERAL.TOOL_TIP,
              eventParams: {
                tooltip: 'Your Total Exposure: your info',
                asset: reserve.underlyingAsset,
                assetName: reserve.name,
              },
            }}
          />
          <Stack
            sx={{ height: '44px' }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <ValueWithSymbol value={(Number(value) * 3).toString()} symbol={symbol} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ my: 6 }} />
      <Stack>
        <AvailableTooltip
          variant="description"
          text={<Trans>Available to loop</Trans>}
          capType={CapType.borrowCap}
          event={{
            eventName: GENERAL.TOOL_TIP,
            eventParams: {
              tooltip: 'Available to borrow: your info',
              asset: reserve.underlyingAsset,
              assetName: reserve.name,
            },
          }}
        />
        <Stack
          sx={{ height: '44px' }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <ValueWithSymbol value={value} symbol={symbol} />
            <FormattedNumber
              value={usdValue}
              variant="subheader2"
              color="text.muted"
              symbolsColor="text.muted"
              symbol="USD"
            />
          </Box>
          <Button
            sx={{
              height: '36px',
              width: '96px',
              backgroundColor: 'background.surface2',
              '&:hover': {
                backgroundColor: 'background.surface',
              },
            }}
            onClick={onActionClicked}
            disabled={disable}
            fullWidth={false}
            variant="contained"
            data-cy="borrowButton"
          >
            <Trans>Loop</Trans>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

const WrappedBaseAssetSelector = ({
  assetSymbol,
  baseAssetSymbol,
  selectedAsset,
  setSelectedAsset,
}: {
  assetSymbol: string;
  baseAssetSymbol: string;
  selectedAsset: string;
  setSelectedAsset: (value: string) => void;
}) => {
  return (
    <StyledTxModalToggleGroup
      color="primary"
      value={selectedAsset}
      exclusive
      onChange={(_, value) => {
        if (value !== selectedAsset) setSelectedAsset(value);
      }}
      sx={{ mb: 4 }}
    >
      <StyledTxModalToggleButton value={assetSymbol}>
        <Typography
          variant="buttonM"
          sx={{ color: `${selectedAsset === assetSymbol ? '#000' : '#FFF'}` }}
        >
          {assetSymbol}
        </Typography>
      </StyledTxModalToggleButton>

      <StyledTxModalToggleButton value={baseAssetSymbol}>
        <Typography
          variant="buttonM"
          sx={{ color: `${selectedAsset === baseAssetSymbol ? '#000' : '#FFF'}` }}
        >
          {baseAssetSymbol}
        </Typography>
      </StyledTxModalToggleButton>
    </StyledTxModalToggleGroup>
  );
};

interface ValueWithSymbolProps {
  value: string;
  symbol: string;
  children?: ReactNode;
}

const ValueWithSymbol = ({ value, symbol, children }: ValueWithSymbolProps) => {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <FormattedNumber value={value} variant="h4" color="text.primary" />
      <Typography variant="buttonL" color="text.secondary">
        {symbol}
      </Typography>
      {children}
    </Stack>
  );
};

interface WalletBalanceProps {
  balance: string;
  symbol: string;
  marketTitle: string;
}
const WalletBalance = ({ balance, symbol, marketTitle }: WalletBalanceProps) => {
  return (
    <Stack direction="row" gap={3}>
      <Box
        sx={(theme) => ({
          width: '42px',
          height: '42px',
          background: '#F7F7F9',
          border: `0.5px solid ${theme.palette.background.disabled}`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <WalletIcon sx={{ stroke: `black` }} />
      </Box>
      <Box>
        <Typography variant="description" color="text.secondary">
          Wallet balance
        </Typography>
        <ValueWithSymbol value={balance} symbol={symbol}>
          <Box sx={{ ml: 2 }}>
            <BuyWithFiat cryptoSymbol={symbol} networkMarketName={marketTitle} />
          </Box>
        </ValueWithSymbol>
      </Box>
    </Stack>
  );
};
