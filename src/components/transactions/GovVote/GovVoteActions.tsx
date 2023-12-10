import { ProtocolAction } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { useTransactionHandler } from 'src/helpers/useTransactionHandler';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { Support } from 'src/services/GovernanceService';
import { useRootStore } from 'src/store/root';

import { TxActionsWrapper } from '../TxActionsWrapper';

export type GovVoteActionsProps = {
  isWrongNetwork: boolean;
  blocked: boolean;
  governorAddress: string;
  proposalId: string;
  support: Support;
};

export const GovVoteActions = ({
  isWrongNetwork,
  blocked,
  governorAddress,
  proposalId,
  support,
}: GovVoteActionsProps) => {
  const castVote = useRootStore((state) => state.castVote);
  const { currentAccount } = useWeb3Context();

  const { action, loadingTxns, mainTxState, requiresApproval } = useTransactionHandler({
    tryPermit: false,
    handleGetTxns: async () => {
      return castVote(governorAddress, proposalId, currentAccount, support);
    },
    protocolAction: ProtocolAction.vote,
    skip: blocked,
    deps: [],
  });

  const voteText =
    support === Support.For ? (
      <Trans>For</Trans>
    ) : support === Support.Against ? (
      <Trans>Against</Trans>
    ) : (
      <Trans>Abstain</Trans>
    );

  return (
    <TxActionsWrapper
      requiresApproval={requiresApproval}
      blocked={blocked}
      mainTxState={mainTxState}
      preparingTransactions={loadingTxns}
      handleAction={action}
      actionText={voteText}
      actionInProgressText={voteText}
      isWrongNetwork={isWrongNetwork}
    />
  );
};
