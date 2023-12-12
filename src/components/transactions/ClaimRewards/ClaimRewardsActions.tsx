import { ProtocolAction } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Reward } from 'src/helpers/types';
import { useTransactionHandler } from 'src/helpers/useTransactionHandler';
import { useRootStore } from 'src/store/root';

import { TxActionsWrapper } from '../TxActionsWrapper';

export type ClaimRewardsActionsProps = {
  isWrongNetwork: boolean;
  blocked: boolean;
  selectedReward: Reward;
  isAll: boolean;
};

export const ClaimRewardsActions = ({
  isWrongNetwork,
  blocked,
  selectedReward,
  isAll,
}: ClaimRewardsActionsProps) => {
  const claimRewards = useRootStore((state) => state.claimRewards);

  const { action, loadingTxns, mainTxState, requiresApproval } = useTransactionHandler({
    protocolAction: ProtocolAction.claimRewards,
    eventTxInfo: {
      assetName: isAll ? 'all' : selectedReward.symbol,
      amount: selectedReward.balance,
    },
    tryPermit: false,
    handleGetTxns: async () => {
      return claimRewards({ isWrongNetwork, blocked, selectedReward, isAll });
    },
    skip: Object.keys(selectedReward).length === 0 || blocked,
    deps: [selectedReward],
  });

  return (
    <TxActionsWrapper
      requiresApproval={requiresApproval}
      blocked={blocked}
      preparingTransactions={loadingTxns}
      mainTxState={mainTxState}
      handleAction={action}
      actionText={
        isAll ? (
          <Trans>Claim all</Trans>
        ) : (
          <Trans>Claim {selectedReward.symbol}</Trans>
        )
      }
      actionInProgressText={<Trans>Claiming</Trans>}
      isWrongNetwork={isWrongNetwork}
    />
  );
};
