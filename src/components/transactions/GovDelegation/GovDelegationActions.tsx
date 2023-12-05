import { useGovernanceDelegate } from 'src/helpers/useGovernanceDelegate';

import { DelegationTxsWrapper } from '../DelegationTxsWrapper';
import { DelegationTokenType } from './DelegationTokenSelector';

export type GovDelegationActionsProps = {
  isWrongNetwork: boolean;
  blocked: boolean;
  delegationTokenType: DelegationTokenType;
  delegatee: string;
  isRevoke: boolean;
};

export const GovDelegationActions = ({
  isWrongNetwork,
  blocked,
  delegationTokenType,
  delegatee,
  isRevoke,
}: GovDelegationActionsProps) => {
  const { signMetaTxs, action, mainTxState, loadingTxns, approvalTxState } = useGovernanceDelegate(
    delegationTokenType,
    blocked,
    delegatee
  );

  // TODO: hash link not working
  return (
    <DelegationTxsWrapper
      isRevoke={isRevoke}
      preparingTransactions={loadingTxns}
      mainTxState={mainTxState}
      handleSignatures={signMetaTxs}
      handleAction={action}
      isWrongNetwork={isWrongNetwork}
      requiresSignature={delegationTokenType === DelegationTokenType.BOTH}
      blocked={blocked}
      approvalTxState={approvalTxState}
    />
  );
};
