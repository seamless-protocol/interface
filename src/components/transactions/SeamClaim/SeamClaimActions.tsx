import React from 'react';
import { Button } from '@mui/material';
import { TxActionsWrapper } from '../TxActionsWrapper';
import { Trans } from '@lingui/react';
import { useRootStore } from 'src/store/root';
import { useTransactionHandler } from 'src/helpers/useTransactionHandler';
import { useModalContext } from 'src/hooks/useModal';
import { TransactionResponse } from '@ethersproject/providers';
import { ProtocolAction } from '@aave/contract-helpers';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { TxAction, getErrorTextFromError } from 'src/ui-config/errorMapping';

export const SeamClaimActions = () => {
  const { claimSeam } = useRootStore();
  console.log('claimSeam');
  console.log(claimSeam);

  const { action, loadingTxns, mainTxState } = useTransactionHandler({
    tryPermit: false,
    handleGetTxns: async () => {
      return claimSeam({});
    },
  });

  console.log('action');
  console.log(action);

  /*
  return (
    <Button variant="contained" sx={{ width: '80%' }}>
      Claim SEAM
    </Button>
  );
  */

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
      sx={{ width: '80%' }}
    ></TxActionsWrapper>
  );
};
