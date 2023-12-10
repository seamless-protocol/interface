import { t, Trans } from '@lingui/macro';
import {
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useHasVoted } from 'src/hooks/governance/useHasVoted';
import { usePowers } from 'src/hooks/governance/usePowers';
import { useProposalState } from 'src/hooks/governance/useProposalState';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { ProposalState, Support } from 'src/services/GovernanceService';
import { governanceConfig } from 'src/ui-config/governanceConfig';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';

import { TxErrorView } from '../FlowCommons/Error';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsNumberLine, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { ChangeNetworkWarning } from '../Warnings/ChangeNetworkWarning';
import { GovVoteActions } from './GovVoteActions';

export interface Asset {
  symbol: string;
  icon: string;
  value: number;
  address: string;
}

export enum ErrorType {
  NOT_ENOUGH_VOTING_POWER,
  NO_PROPOSAL_ID,
  HAS_VOTED,
  PROPOSAL_NOT_ACTIVE,
}

export const GovVoteModalContent = () => {
  const { query } = useRouter();

  const { chainId: connectedChainId, readOnlyModeAddress } = useWeb3Context();
  const { gasLimit, mainTxState: txState, txError } = useModalContext();
  const { currentNetworkConfig, currentChainId } = useProtocolDataContext();
  const { data: powers } = usePowers();

  const governorAddressQuery =
    query['governorAddress'] === undefined || Array.isArray(query['governorAddress'])
      ? governanceConfig.addresses.GOVERNOR_SHORT_ADDRESS.toLocaleLowerCase()
      : (query['governorAddress'] as string).toLocaleLowerCase();
  const proposalIdQuery =
    query['proposalId'] === undefined || Array.isArray(query['proposalId'])
      ? ''
      : (query['proposalId'] as string);

  const [proposalId, setProposalId] = useState(proposalIdQuery);
  const [governorAddress, setGovernorAddress] = useState(governorAddressQuery);
  const [support, setSupport] = useState<Support>(Support.Abstain);

  const { data: proposalState } = useProposalState(governorAddress, proposalId);
  const { data: hasVoted } = useHasVoted(governorAddress, proposalId);

  // handle delegate address errors
  let blockingError: ErrorType | undefined = undefined;
  if (proposalId === '') {
    blockingError = ErrorType.NO_PROPOSAL_ID;
  } else if (proposalState !== ProposalState.Active) {
    blockingError = ErrorType.PROPOSAL_NOT_ACTIVE;
  } else if (hasVoted) {
    blockingError = ErrorType.HAS_VOTED;
  } else if (powers?.votingPower === '0') {
    blockingError = ErrorType.NOT_ENOUGH_VOTING_POWER;
  }

  const handleError = () => {
    switch (blockingError) {
      case ErrorType.NOT_ENOUGH_VOTING_POWER:
        return (
          // TODO: fix text
          <Trans>No voting power</Trans>
        );
      case ErrorType.NO_PROPOSAL_ID:
        return <Trans>No proposal ID entered</Trans>;
      case ErrorType.HAS_VOTED:
        return <Trans>You have already cast your vote on this proposal</Trans>;
      case ErrorType.PROPOSAL_NOT_ACTIVE:
        return (
          <Trans>This proposal is not active. Either voting has not started or it has ended.</Trans>
        );
      default:
        return null;
    }
  };

  // is Network mismatched
  const govChain =
    currentNetworkConfig.isFork &&
    currentNetworkConfig.underlyingChainId === governanceConfig.chainId
      ? currentChainId
      : governanceConfig.chainId;
  const isWrongNetwork = connectedChainId !== govChain;

  const networkConfig = getNetworkConfig(govChain);

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }

  if (txState.success) return <TxSuccessView customText={<Trans>Thank you for voting!!</Trans>} />;

  return (
    <>
      <TxModalTitle title="Governance vote" />
      {isWrongNetwork && !readOnlyModeAddress && (
        <ChangeNetworkWarning networkName={networkConfig.name} chainId={govChain} />
      )}
      <DetailsNumberLine description={<Trans>Voting power</Trans>} value={powers?.votingPower} />
      <TxModalDetails gasLimit={gasLimit}>
        <FormControl
          error={blockingError !== undefined}
          variant="standard"
          fullWidth
          sx={{ mb: 4 }}
        >
          <TextField
            variant="outlined"
            fullWidth
            value={proposalId}
            onChange={(e) => setProposalId(e.target.value)}
            placeholder={t`Enter Proposal ID`}
            data-cy={`proposalId`}
            error={blockingError !== undefined}
            helperText={handleError()}
          />
        </FormControl>
        <Divider />
        <FormControl variant="standard" fullWidth sx={{ my: 4 }}>
          <RadioGroup
            value={governorAddress}
            onChange={(e) => setGovernorAddress(e.target.value as string)}
            row={true}
          >
            <FormControlLabel
              value={governanceConfig.addresses.GOVERNOR_SHORT_ADDRESS.toLocaleLowerCase()}
              control={<Radio size="small" />}
              componentsProps={{ typography: { width: '100%' } }}
              label={<Trans>Governor short</Trans>}
              data-cy={`governor-short`}
            />
            <FormControlLabel
              value={governanceConfig.addresses.GOVERNOR_LONG_ADDRESS.toLocaleLowerCase()}
              control={<Radio size="small" />}
              componentsProps={{ typography: { width: '100%' } }}
              label={<Trans>Governor long</Trans>}
              data-cy={`governor-long`}
            />
          </RadioGroup>
        </FormControl>
        <Divider />
        <FormControl variant="standard" fullWidth sx={{ mt: 4 }}>
          <RadioGroup
            value={support}
            onChange={(e) => setSupport(Number(e.target.value) as Support)}
            row={true}
          >
            <FormControlLabel
              value={Support.For}
              control={<Radio size="small" />}
              componentsProps={{ typography: { width: '100%' } }}
              label={<Trans>For</Trans>}
              data-cy={`vote-for`}
            />
            <FormControlLabel
              value={Support.Against}
              control={<Radio size="small" />}
              componentsProps={{ typography: { width: '100%' } }}
              label={<Trans>Against</Trans>}
              data-cy={`vote-against`}
            />
            <FormControlLabel
              value={Support.Abstain}
              control={<Radio size="small" />}
              componentsProps={{ typography: { width: '100%' } }}
              label={<Trans>Abstain</Trans>}
              data-cy={`vote-abstain`}
            />
          </RadioGroup>
        </FormControl>
      </TxModalDetails>

      {blockingError === undefined && txError && <GasEstimationError txError={txError} />}

      <GovVoteActions
        governorAddress={governorAddress}
        proposalId={proposalId}
        support={support}
        isWrongNetwork={isWrongNetwork}
        blocked={blockingError !== undefined}
      />
    </>
  );
};
