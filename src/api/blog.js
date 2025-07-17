import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetPosts() {
  const URL = endpoints.post.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const refreshPosts = useCallback(() => {
    mutate(URL);
  }, [URL]);
  const memoizedValue = useMemo(
    () => ({
      posts: data || [],
      postsLoading: isLoading,
      postsError: error,
      postsValidating: isValidating,
      postsEmpty: !isLoading && !data?.length,
      refreshPosts,
    }),
    [data, error, isLoading, isValidating, refreshPosts]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPost(slug) {
  const URL = slug ? `${endpoints.post.details}/${slug}` : '';
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      post: data,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetLatestPosts(title) {
  const URL = title ? [endpoints.post.latest, { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      latestPosts: data?.latestPosts || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !data?.latestPosts.length,
    }),
    [data?.latestPosts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchPosts(query) {
  const URL = query ? [endpoints.post.list, { params: { query } }] : '';

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
