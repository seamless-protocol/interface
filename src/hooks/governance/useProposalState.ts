import { useQuery } from '@tanstack/react-query';
import { POLLING_INTERVAL, QueryKeys } from 'src/ui-config/queries';
import { useSharedDependencies } from 'src/ui-config/SharedDependenciesProvider';

export const useProposalState = (governorAddress?: string, proposalId?: string) => {
  const { governanceService } = useSharedDependencies();

  return useQuery({
    queryFn: () => governanceService.getProposalState(governorAddress!, proposalId!),
    queryKey: [QueryKeys.PROPOSAL_SATE, governorAddress, proposalId, governanceService.toHash()],
    enabled: !!governorAddress && !!proposalId,
    refetchInterval: POLLING_INTERVAL,
  });
};
