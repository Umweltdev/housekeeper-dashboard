import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetUsers() {
  const URL = endpoints.user.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const refreshUsers = useCallback(() => {
    mutate(URL);
  }, [URL]);
  const memoizedValue = useMemo(
    () => ({
      users: data || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.length,
      refreshUsers,
    }),
    [data, error, isLoading, isValidating, refreshUsers]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetUser(id) {
  const URL = id ? `${endpoints.user.details}/${id}` : '';
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      user: data,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
