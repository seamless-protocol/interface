import React from 'react';
import { useTransactionHandler } from 'src/helpers/useTransactionHandler';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { governanceConfig } from 'src/ui-config/governanceConfig';

import { TxActionsWrapper } from '../TxActionsWrapper';

export const VestedEsSEAMClaimActions = ({ blocked }: { blocked: boolean }) => {
  const { currentAccount, chainId: connectedChainId } = useWeb3Context();
  const { currentNetworkConfig, currentChainId } = useProtocolDataContext();
  const claimVestedEsSEAM = useRootStore((state) => state.claimVestedEsSEAM);

  const govChain =
    currentNetworkConfig.isFork &&
    currentNetworkConfig.underlyingChainId === governanceConfig.chainId
      ? currentChainId
      : governanceConfig.chainId;
  const isWrongNetwork = connectedChainId !== govChain;

  const { action, loadingTxns, mainTxState, requiresApproval } = useTransactionHandler({
    tryPermit: false,
    handleGetTxns: async () => {
      return claimVestedEsSEAM(currentAccount);
    },
  });

  return (
    <TxActionsWrapper
      requiresApproval={requiresApproval}
      blocked={blocked}
      preparingTransactions={loadingTxns}
      handleAction={action}
      actionText="Claim"
      actionInProgressText="Claiming"
      mainTxState={mainTxState}
      isWrongNetwork={isWrongNetwork}
      sx={{ width: '80%', textAlign: 'center', mt: 0 }}
    />
  );
};
