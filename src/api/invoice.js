import useSWR, { mutate } from 'swr';
import { useMemo, useCallback } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetInvoices() {
  const URL = endpoints.invoice.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const refreshInvoices = useCallback(() => {
    mutate(URL);
  }, [URL]);
  const memoizedValue = useMemo(
    () => ({
      invoices: data || [],
      invoicesLoading: isLoading,
      invoicesError: error,
      invoicesValidating: isValidating,
      invoicesEmpty: !isLoading && !data?.length,
      refreshInvoices,
    }),
    [data, error, isLoading, isValidating, refreshInvoices]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetInvoice(id) {
  const URL = id ? `${endpoints.invoice.details}/${id}` : '';
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      invoice: data,
      invoiceLoading: isLoading,
      invoiceError: error,
      invoiceValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
