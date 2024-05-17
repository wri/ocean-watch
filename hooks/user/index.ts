import { useQuery } from 'react-query';
import { useSession } from 'next-auth/client';

// services
import { fetchUser } from 'services/user';

import type { QueryObserverOptions } from 'react-query';
import type { User, UserWithToken } from 'types/user';

const useFetchUser = (
  userToken: string,
  queryConfig?: QueryObserverOptions<User, Error, UserWithToken>,
) => useQuery<User, Error, UserWithToken>('me', () => fetchUser(userToken), queryConfig);

export const useMe = (queryConfig?: QueryObserverOptions<User, Error, UserWithToken>) => {
  const [session] = useSession();

  return useFetchUser(`Bearer ${session?.accessToken}`, {
    enabled: !!session?.accessToken,
    refetchOnWindowFocus: false,
    select: (user): UserWithToken =>
      user && {
        ...user,
        token: `Bearer ${session?.accessToken}`,
      },
    ...queryConfig,
  });
};
