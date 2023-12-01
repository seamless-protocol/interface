import React from 'react';
import { Button } from '@mui/material';
import { TxActionsWrapper } from '../TxActionsWrapper';
import { Trans } from '@lingui/react';
import { useRootStore } from 'src/store/root';
import { useTransactionHandler } from 'src/helpers/useTransactionHandler';
import { useModalContext } from 'src/hooks/useModal';
import { TransactionResponse } from '@ethersproject/providers';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { governanceConfig } from 'src/ui-config/governanceConfig';
import { TxAction, TxErrorType, getErrorTextFromError } from 'src/ui-config/errorMapping';

export const SeamClaimActions = () => {
  const { currentAccount, sendTx } = useWeb3Context();
  const { setMainTxState, setTxError } = useModalContext();
  const { claimSeam, estimateGasLimit } = useRootStore();

  const { loadingTxns, mainTxState } = useTransactionHandler({
    tryPermit: false,
    handleGetTxns: async () => {
      return claimSeam();
    },
  });

  const action = async () => {
    try {
      setMainTxState({ ...mainTxState, loading: true });

      const encodedFunctionCall = claimSeam();
      let supplyTxData = {
        ...encodedFunctionCall,
        from: currentAccount,
        to: governanceConfig.esSEAMTokenAddress,
      };
      supplyTxData = await estimateGasLimit(supplyTxData);

      const response: TransactionResponse = await sendTx(supplyTxData);
      await response.wait(1);

      setMainTxState({
        txHash: response.hash,
        loading: false,
        success: true,
      });
    } catch (error) {
      const parsedError = getErrorTextFromError(error, TxAction.GAS_ESTIMATION, false);
      setTxError(parsedError);
      setMainTxState({
        txHash: undefined,
        loading: false,
      });
    }
  };

  return (
    <TxActionsWrapper
      requiresApproval={false}
      blocked={false}
      preparingTransactions={false}
      handleAction={action}
      actionText="Claim SEAM"
      actionInProgressText="Claiming SEAM"
      mainTxState={mainTxState}
      isWrongNetwork={false}
      sx={{ width: '80%', textAlign: 'center' }}
    ></TxActionsWrapper>
  );
};
