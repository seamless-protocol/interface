import { useQuery } from '@tanstack/react-query';
import { useRootStore } from 'src/store/root';
import { POLLING_INTERVAL, QueryKeys } from 'src/ui-config/queries';
import { useSharedDependencies } from 'src/ui-config/SharedDependenciesProvider';

export const useVestedSeamBalance = () => {
  const { governanceService } = useSharedDependencies();
  const user = useRootStore((store) => store.account);
  console.log('useVestedSeamBalance');
  console.log(user);
  console.log('use');
  return useQuery({
    queryFn: () => governanceService.getVestedSeamBalance(user),
    queryKey: [QueryKeys.VESTED_SEAM_BALANCE, user, governanceService.toHash()],
    enabled: !!user,
    // refetchInterval: POLLING_INTERVAL,
  });
};
