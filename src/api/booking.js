import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

export function useGetBookings() {
  const URL = endpoints.booking.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const refreshBookings = useCallback(() => {
    mutate(URL);
  }, [URL]);

  return useMemo(
    () => ({
      bookings: data || [],
      bookingsLoading: isLoading,
      bookingsError: error,
      bookingsValidating: isValidating,
      bookingsEmpty: !isLoading && !data?.length,
      refreshBookings,
    }),
    [data, error, isLoading, isValidating, refreshBookings]
  );
}

export function useGetBooking(id) {
  const URL = id ? `${endpoints.booking.details}/${id}` : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  return useMemo(
    () => ({
      booking: data,
      bookingLoading: isLoading,
      bookingError: error,
      bookingValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
}

// ----------------------------------------------------------------------
export function useCancelBooking() {
  const cancelBooking = async (bookingId) => {
    const URL = `${endpoints.booking.details}/cancelBooking/${bookingId}`;
    try {
      const response = await axiosInstance.put(URL);
      // Refresh bookings after a successful cancellation
      mutate(endpoints.booking.list);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  return { cancelBooking };
}

// -----------------------------------------------------------------------
export function useCheckoutBooking() {
  const checkoutBooking = async (bookingId) => {
    const URL = `${endpoints.booking.details}/checkout/${bookingId}`;
    try {
      const response = await axiosInstance.put(URL);

      mutate(endpoints.booking.list);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  return { checkoutBooking };
}

// -----------------------------------------------------------------------
export function useExtendStay() {
  const extendStay = async (bookingId, newCheckOutDate) => {
    const URL = `${endpoints.booking.list}/extendstay/${bookingId}`;
    console.log('Extend Stay API URL:', URL);
    console.log('Payload:', { newCheckOutDate });

    try {
      const response = await axiosInstance.put(URL, {
        newCheckOutDate,
      });

      mutate(endpoints.booking.list);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  return { extendStay };
}
