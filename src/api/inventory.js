import useSWR, { mutate } from 'swr';
import { useMemo, useCallback, useState } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export function useCreateInventory() {
  const { enqueueSnackbar } = useSnackbar();

  const createInventory = useCallback(
    async (data) => {
      console.log('CREATE_INVENTORY_REQUEST:', data); // Debug log
      try {
        const response = await fetcher([endpoints.inventory.create, { method: 'POST', data }]);
        console.log('CREATE_INVENTORY_RESPONSE:', response); // Debug log
        // Refresh related inventory data
        mutate(endpoints.inventory.list);
        mutate(`${endpoints.inventory.list}/housekeeper/${data.housekeeperId}`);
        enqueueSnackbar('Inventory request created successfully', { variant: 'success' });
        return response;
      } catch (error) {
        console.error('CREATE_INVENTORY_ERROR:', error.response?.data || error.message); // Debug log
        enqueueSnackbar('Failed to create inventory request', { variant: 'error' });
        throw error;
      }
    },
    [enqueueSnackbar]
  );

  return useMemo(() => ({ createInventory }), [createInventory]);
}

// ----------------------------------------------------------------------

export function useGetAllInventories() {
  const URL = endpoints.inventory.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const refreshInventories = useCallback(() => {
    mutate(URL);
  }, [URL]);

  return useMemo(
    () => ({
      inventories: data || [],
      inventoriesLoading: isLoading,
      inventoriesError: error,
      inventoriesValidating: isValidating,
      inventoriesEmpty: !isLoading && !data?.length,
      refreshInventories,
    }),
    [data, error, isLoading, isValidating, refreshInventories]
  );
}

// ----------------------------------------------------------------------

export function useGetInventoryById(id) {
  const URL = id ? `${endpoints.inventory.details}/${id}` : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const refreshInventory = useCallback(() => {
    if (URL) mutate(URL);
  }, [URL]);

  return useMemo(
    () => ({
      inventory: data || null,
      inventoryLoading: isLoading,
      inventoryError: error,
      inventoryValidating: isValidating,
      refreshInventory,
    }),
    [data, error, isLoading, isValidating, refreshInventory]
  );
}

// ----------------------------------------------------------------------

export function useGetInventoryByHousekeeper(housekeeperId) {
  const URL = housekeeperId ? `${endpoints.inventory.list}/housekeeper/${housekeeperId}` : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const refreshInventory = useCallback(() => {
    if (URL) mutate(URL);
  }, [URL]);

  return useMemo(
    () => ({
      inventories: data || [],
      inventoriesLoading: isLoading,
      inventoriesError: error,
      inventoriesValidating: isValidating,
      inventoriesEmpty: !isLoading && !data?.length,
      refreshInventory,
    }),
    [data, error, isLoading, isValidating, refreshInventory]
  );
}

// ----------------------------------------------------------------------

export function useDeleteInventory() {
  const { enqueueSnackbar } = useSnackbar();

  const deleteInventory = useCallback(
    async (id, housekeeperId) => {
      console.log('DELETE_INVENTORY_REQUEST:', { id, housekeeperId }); // Debug log
      try {
        const response = await fetcher([
          `${endpoints.inventory.delete}/${id}`,
          { method: 'DELETE' },
        ]);
        console.log('DELETE_INVENTORY_RESPONSE:', response); // Debug log
        // Refresh related inventory data
        mutate(endpoints.inventory.list);
        mutate(`${endpoints.inventory.list}/housekeeper/${housekeeperId}`);
        enqueueSnackbar('Inventory request deleted successfully', { variant: 'success' });
        return response;
      } catch (error) {
        console.error('DELETE_INVENTORY_ERROR:', error.response?.data || error.message); // Debug log
        enqueueSnackbar('Failed to delete inventory request', { variant: 'error' });
        throw error;
      }
    },
    [enqueueSnackbar]
  );

  return useMemo(() => ({ deleteInventory }), [deleteInventory]);
}

// ----------------------------------------------------------------------
