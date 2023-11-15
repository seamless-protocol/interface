import { Trans } from '@lingui/macro';
import React, { useRef, useState } from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { stakeConfig } from 'src/ui-config/stakeConfig';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';
import { CLAIM_AIRDROP } from 'src/utils/mixPanelEvents';

import { AssetInput } from '../transactions/AssetInput';
import { TxErrorView } from '../transactions/FlowCommons/Error';
import { GasEstimationError } from '../transactions/FlowCommons/GasEstimationError';
import { TxSuccessView } from '../transactions/FlowCommons/Success';
import { DetailsNumberLine, TxModalDetails } from '../transactions/FlowCommons/TxModalDetails';
import { TxModalTitle } from '../transactions/FlowCommons/TxModalTitle';
import { ChangeNetworkWarning } from '../transactions/Warnings/ChangeNetworkWarning';
import { ClaimActions } from './ClaimActions';

export type StakeProps = {
  claimAssetName: string;
  icon: string;
};

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

export const ClaimModalContent = ({ claimAssetName, icon }: StakeProps) => {
  const { chainId: connectedChainId, readOnlyModeAddress } = useWeb3Context();
  const { gasLimit, mainTxState: txState, txError } = useModalContext();
  const { currentNetworkConfig, currentChainId } = useProtocolDataContext();

  // states
  const [, setAmount] = useState('');
  const amountRef = useRef<string>();

  const handleChange = (value: string) => {
    amountRef.current = value;
    setAmount(value);
  };

  // error handler
  const blockingError: ErrorType | undefined = undefined;

  const stakingChain =
    currentNetworkConfig.isFork && currentNetworkConfig.underlyingChainId === stakeConfig.chainId
      ? currentChainId
      : stakeConfig.chainId;
  const isWrongNetwork = connectedChainId !== stakingChain;

  const networkConfig = getNetworkConfig(stakingChain);

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (txState.success)
    return (
      <TxSuccessView action={<Trans>Claimed</Trans>} amount={amountRef.current} symbol={icon} />
    );

  return (
    <>
      <TxModalTitle title="Claim" symbol={icon} />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning
          networkName={networkConfig.name}
          chainId={stakingChain}
          funnel={'Stake Modal'}
        />
      )}

      <AssetInput
        value={'100'}
        onChange={handleChange}
        usdValue={'10000'}
        symbol={icon}
        assets={[
          {
            balance: '10000',
            symbol: icon,
          },
        ]}
        isMaxSelected={false}
        maxValue={'10000'}
        balanceText={<Trans>Available claim</Trans>}
      />
      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLine description={<Trans>Claiming SEAM</Trans>} value={100} />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <ClaimActions
        sx={{ mt: '48px' }}
        amountToStake={'100'}
        isWrongNetwork={isWrongNetwork}
        symbol={icon}
        blocked={blockingError !== undefined}
        selectedToken={claimAssetName}
        event={CLAIM_AIRDROP.CLAIM_AIRDROP}
      />
    </>
  );
};
