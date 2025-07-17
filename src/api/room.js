import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetRooms() {
  const URL = endpoints.room.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const refreshRooms = useCallback(() => {
    mutate(URL);
  }, [URL]);
  const memoizedValue = useMemo(
    () => ({
      rooms: data || [],
      roomsLoading: isLoading,
      roomsError: error,
      roomsValidating: isValidating,
      roomsEmpty: !isLoading && !data?.length,
      refreshRooms,
    }),
    [data, error, isLoading, isValidating, refreshRooms]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetRoom(id) {
  const URL = id ? `${endpoints.room.details}/${id}` : '';
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      room: data,
      roomLoading: isLoading,
      roomError: error,
      roomValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchRooms(query) {
  const URL = query ? [endpoints.room.list, { params: { query } }] : '';

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

export function useGetRoomsByRoomType(id) {
  const URL = id ? `/api/room?roomType=${id}` : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const refreshRooms = useCallback(() => {
    if (URL) mutate(URL);
  }, [URL]);

  const memoizedValue = useMemo(
    () => ({
      rooms: data || [],
      roomsLoading: isLoading,
      roomsError: error,
      roomsValidating: isValidating,
      roomsEmpty: !isLoading && !data?.length,
      refreshRooms,
    }),
    [data, error, isLoading, isValidating, refreshRooms]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useUpdateRoom() {
  const updateRoom = async (id, updates) => {
    if (!id) throw new Error('Room ID is required for updates.');

    try {
      const URL = `${endpoints.room.updateRoom}/${id}`;

      const response = await fetcher.put(URL, updates);

      mutate(endpoints.room.list);

      mutate(URL);

      return response.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  };

  return { updateRoom };
}

