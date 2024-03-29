import { useQuery } from '@tanstack/react-query';
import { useRootStore } from 'src/store/root';
import { POLLING_INTERVAL, QueryKeys } from 'src/ui-config/queries';
import { useSharedDependencies } from 'src/ui-config/SharedDependenciesProvider';

export const useVestedEsSEAM = () => {
  const { governanceService } = useSharedDependencies();
  const user = useRootStore((store) => store.account);

  return useQuery({
    queryFn: () => governanceService.getVestedEsSEAM(user),
    queryKey: [QueryKeys.VESTED_ESSEAM_BALANCE, user, governanceService.toHash()],
    enabled: !!user,
    refetchInterval: POLLING_INTERVAL,
    initialData: '0',
  });
};
