import { Trans } from '@lingui/macro';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircleIcon } from 'src/components/CircleIcon';
import { WalletIcon } from 'src/components/icons/WalletIcon';
import { Base64Token, TokenIcon } from 'src/components/primitives/TokenIcon';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { ERC20TokenType } from 'src/libs/web3-data-provider/Web3Provider';
import { useRootStore } from 'src/store/root';
import { RESERVE_DETAILS } from 'src/utils/mixPanelEvents';

interface AddTokenDropdownProps {
  poolReserve?: ComputedReserveData;
  downToSM: boolean;
  switchNetwork: (chainId: number) => Promise<void>;
  addERC20Token: (args: ERC20TokenType) => Promise<boolean>;
  currentChainId: number;
  connectedChainId: number;
  hideSToken?: boolean;
  addRewardTokens?: ERC20TokenType[];
  isReward?: boolean;
}

interface RewardTokensBase64 {
  [symbol: string]: string;
}

export const AddTokenDropdown = ({
  poolReserve,
  downToSM,
  switchNetwork,
  addERC20Token,
  currentChainId,
  connectedChainId,
  hideSToken,
  addRewardTokens,
  isReward,
}: AddTokenDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [changingNetwork, setChangingNetwork] = useState(false);
  const [underlyingBase64, setUnderlyingBase64] = useState('');
  const [aTokenBase64, setATokenBase64] = useState('');
  const [rewardTokensBase64, setRewardTokensBase64] = useState<RewardTokensBase64>();
  const open = Boolean(anchorEl);
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (changingNetwork && currentChainId === connectedChainId && addRewardTokens) {
      const promises: Promise<boolean>[] = [];
      addRewardTokens.forEach((rewardToken) =>
        promises.push(
          addERC20Token({
            address: rewardToken.address,
            decimals: rewardToken.decimals,
            symbol: rewardToken.symbol,
            image: !/_/.test(rewardToken.symbol)
              ? rewardTokensBase64?.[rewardToken.symbol]
              : undefined,
          })
        )
      );
      Promise.all(promises);
      setChangingNetwork(false);
    }
  }, [
    currentChainId,
    connectedChainId,
    changingNetwork,
    addERC20Token,
    addRewardTokens,
    rewardTokensBase64,
  ]);

  // The switchNetwork function has no return type, so to detect if a user successfully switched networks before adding token to wallet, check the selected vs connected chain id
  useEffect(() => {
    if (changingNetwork && currentChainId === connectedChainId && poolReserve) {
      addERC20Token({
        address: poolReserve.underlyingAsset,
        decimals: poolReserve.decimals,
        symbol: poolReserve.symbol,
        image: !/_/.test(poolReserve.iconSymbol) ? underlyingBase64 : undefined,
      });
      setChangingNetwork(false);
    }
  }, [
    currentChainId,
    connectedChainId,
    changingNetwork,
    addERC20Token,
    poolReserve?.underlyingAsset,
    poolReserve?.decimals,
    poolReserve?.symbol,
    poolReserve?.iconSymbol,
    underlyingBase64,
  ]);

  if (!poolReserve && !addRewardTokens) {
    return null;
  }

  return (
    <>
      {/* Load base64 token symbol for adding underlying and aTokens to wallet */}
      {poolReserve?.symbol && !/_/.test(poolReserve.symbol) && (
        <>
          <Base64Token
            symbol={poolReserve.iconSymbol}
            onImageGenerated={setUnderlyingBase64}
            aToken={false}
          />
          {!hideSToken && (
            <Base64Token
              symbol={poolReserve.iconSymbol}
              onImageGenerated={setATokenBase64}
              aToken={true}
            />
          )}
        </>
      )}
      {addRewardTokens?.map(
        (addRewardToken) =>
          addRewardToken.symbol &&
          !/_/.test(addRewardToken.symbol) && (
            <Base64Token
              key={addRewardToken.address}
              symbol={addRewardToken.symbol}
              onImageGenerated={(base64) =>
                setRewardTokensBase64({ ...rewardTokensBase64, [addRewardToken.symbol]: base64 })
              }
              aToken={addRewardToken.sToken}
            />
          )
      )}
      <Box onClick={handleClick}>
        <CircleIcon tooltipText="Add token to wallet" downToSM={downToSM}>
          <Box
            onClick={() => {
              if (poolReserve) {
                trackEvent(RESERVE_DETAILS.ADD_TOKEN_TO_WALLET_DROPDOWN, {
                  asset: poolReserve.underlyingAsset,
                  assetName: poolReserve.name,
                });
              }
            }}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              '&:hover': {
                '.Wallet__icon': { opacity: '0 !important' },
                '.Wallet__iconHover': { opacity: '1 !important' },
              },
              cursor: 'pointer',
            }}
          >
            <WalletIcon sx={{ width: '14px', height: '14px', '&:hover': { stroke: '#F1F1F3' } }} />
          </Box>
        </CircleIcon>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        keepMounted={true}
        data-cy="addToWaletSelector"
      >
        <Box sx={{ px: 4, pt: 3, pb: 2 }}>
          <Typography variant="secondary12" color="text.secondary">
            <Trans>{isReward ? 'Reward token' : 'Underlying token'}</Trans>
          </Typography>
        </Box>

        {addRewardTokens?.map((addRewardToken) => (
          <MenuItem
            key={addRewardToken.address}
            value="rewardToken"
            divider
            onClick={() => {
              if (currentChainId !== connectedChainId) {
                switchNetwork(currentChainId).then(() => {
                  setChangingNetwork(true);
                });
              } else {
                addERC20Token({
                  address: addRewardToken.address,
                  decimals: addRewardToken.decimals,
                  symbol: addRewardToken.symbol,
                  image: !/_/.test(addRewardToken.symbol) ? rewardTokensBase64?.[addRewardToken.symbol] : undefined,
                });
              }
              handleClose();
            }}
          >
            <TokenIcon symbol={addRewardToken.symbol} sx={{ fontSize: '20px' }} />
            <Typography variant="subheader1" sx={{ ml: 3 }} noWrap data-cy={`assetName`}>
              {addRewardToken.symbol}
            </Typography>
          </MenuItem>
        ))}

        {poolReserve && (
          <MenuItem
            key="underlying"
            value="underlying"
            divider
            onClick={() => {
              if (currentChainId !== connectedChainId) {
                switchNetwork(currentChainId).then(() => {
                  setChangingNetwork(true);
                });
              } else {
                trackEvent(RESERVE_DETAILS.ADD_TO_WALLET, {
                  type: 'Underlying token',
                  asset: poolReserve.underlyingAsset,
                  assetName: poolReserve.name,
                });

                addERC20Token({
                  address: poolReserve.underlyingAsset,
                  decimals: poolReserve.decimals,
                  symbol: poolReserve.symbol,
                  image: !/_/.test(poolReserve.symbol) ? underlyingBase64 : undefined,
                });
              }
              handleClose();
            }}
          >
            <TokenIcon symbol={poolReserve.iconSymbol} sx={{ fontSize: '20px' }} />
            <Typography variant="subheader1" sx={{ ml: 3 }} noWrap data-cy={`assetName`}>
              {poolReserve.symbol}
            </Typography>
          </MenuItem>
        )}
        {!hideSToken && poolReserve && (
          <Box>
            <Box sx={{ px: 4, pt: 3, pb: 2 }}>
              <Typography variant="secondary12" color="text.secondary">
                <Trans>Seamless sToken</Trans>
              </Typography>
            </Box>
            <MenuItem
              key="atoken"
              value="atoken"
              onClick={() => {
                if (currentChainId !== connectedChainId) {
                  switchNetwork(currentChainId).then(() => {
                    setChangingNetwork(true);
                  });
                } else {
                  trackEvent(RESERVE_DETAILS.ADD_TO_WALLET, {
                    asset: poolReserve.underlyingAsset,
                    assetName: poolReserve.name,
                  });

                  addERC20Token({
                    address: poolReserve.aTokenAddress,
                    decimals: poolReserve.decimals,
                    symbol: `s${poolReserve.symbol}`,
                    image: !/_/.test(poolReserve.symbol) ? aTokenBase64 : undefined,
                  });
                }
                handleClose();
              }}
            >
              <TokenIcon symbol={poolReserve.iconSymbol} sx={{ fontSize: '20px' }} aToken={true} />
              <Typography variant="subheader1" sx={{ ml: 3 }} noWrap data-cy={`assetName`}>
                {`s${poolReserve.symbol}`}
              </Typography>
            </MenuItem>
          </Box>
        )}
      </Menu>
    </>
  );
};
