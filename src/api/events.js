import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetEvents() {
  const URL = endpoints.event.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const refreshEvents = useCallback(() => {
    mutate(URL);
  }, [URL]);
  const memoizedValue = useMemo(
    () => ({
      events: data || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.length,
      refreshEvents,
    }),
    [data, error, isLoading, isValidating, refreshEvents]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetEvent(slug) {
  const URL = slug ? `${endpoints.event.details}/${slug}` : '';
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      event: data,
      eventLoading: isLoading,
      eventError: error,
      eventValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchEvents(query) {
  const URL = query ? [endpoints.event.list, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------
