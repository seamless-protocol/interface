import { useQuery } from '@tanstack/react-query';
import { useRootStore } from 'src/store/root';
import { POLLING_INTERVAL, QueryKeys } from 'src/ui-config/queries';
import { useSharedDependencies } from 'src/ui-config/SharedDependenciesProvider';

export const useHasVoted = (governorAddress?: string, proposalId?: string) => {
  const { governanceService } = useSharedDependencies();
  const user = useRootStore((store) => store.account);

  return useQuery({
    queryFn: () => governanceService.getHasVotedOnProposal(governorAddress!, proposalId!, user),
    queryKey: [QueryKeys.PROPOSAL_SATE, governorAddress, proposalId, governanceService.toHash()],
    enabled: !!user && !!governorAddress && !!proposalId,
    refetchInterval: POLLING_INTERVAL,
  });
};
