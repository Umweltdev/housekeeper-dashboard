import useSWR, { mutate } from 'swr';
import { useMemo, useCallback, useState } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export function useGetTasks() {
  const URL = endpoints.task.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const refreshTasks = useCallback(() => {
    mutate(URL);
  }, [URL]);

  return useMemo(
    () => ({
      tasks: data || [],
      tasksLoading: isLoading,
      tasksError: error,
      tasksValidating: isValidating,
      tasksEmpty: !isLoading && !data?.length,
      refreshTasks,
    }),
    [data, error, isLoading, isValidating, refreshTasks]
  );
}

// ----------------------------------------------------------------------

export function useGetTask(taskId) {
  const URL = taskId ? `${endpoints.task.list}/${taskId}` : null; // Use correct endpoint
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  const normalizedTask = useMemo(() => {
    if (!data) return null;

    const taskData = data.data; // Access the nested data object

    return {
      ...taskData,
      status: {
        ...taskData.status,
        statusType: taskData.status?.statusType || 'dirty',
        description: taskData.status?.description || '',
        detailedIssues: taskData.status?.detailedIssues || [],
        maintenanceAndDamages: taskData.status?.maintenanceAndDamages || [],
      },
      roomId: {
        ...taskData.roomId,
        roomNumber: taskData.roomId?.roomNumber || 'N/A',
        roomType: taskData.roomId?.roomType
          ? { _id: taskData.roomId.roomType, title: 'Unknown' } // Placeholder until roomType is fetched
          : { title: 'Unknown' },
      },
      priority: taskData.priority || 'medium',
    };
  }, [data]);

  return {
    task: normalizedTask,
    taskLoading: isLoading,
    taskError: error,
    taskValidating: isValidating,
  };
}

// ----------------------------------------------------------------------

export function useUpdateTask(taskId) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const URL = `${endpoints.task.list}/${taskId}`;

  const updateTask = useCallback(
    async (updatedTask, housekeeperId) => {
      console.log('Sending PUT request to:', URL, 'with data:', updatedTask);
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetcher([
          URL,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            data: updatedTask,
          },
        ]);
        // Revalidate caches to ensure fresh data
        await Promise.all([
          mutate(endpoints.task.list, undefined, { revalidate: true }),
          mutate(URL, undefined, { revalidate: true }),
          housekeeperId &&
            mutate(`${endpoints.task.list}/housekeeper/${housekeeperId}`, undefined, {
              revalidate: true,
            }),
        ]);
        enqueueSnackbar('Task updated successfully!', { variant: 'success' });
        return response;
      } catch (err) {
        console.error('Update task error:', err);
        setError(err);
        enqueueSnackbar('Failed to update task', { variant: 'error' });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar, URL]
  );

  return { mutate: updateTask, isLoading, error };
}

// ----------------------------------------------------------------------

export function useGetTasksByHousekeeper(housekeeperId) {
  const URL = `${endpoints.task.list}/housekeeper/${housekeeperId}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  const refreshTasks = useCallback(() => {
    mutate(URL);
  }, [URL]);

  return useMemo(
    () => ({
      tasks: data || [],
      tasksLoading: isLoading,
      tasksError: error,
      tasksValidating: isValidating,
      tasksEmpty: !isLoading && !data?.data?.length,
      refreshTasks,
    }),
    [data, error, isLoading, isValidating, refreshTasks]
  );
}
// ----------------------------------------------------------------------

export function useCreateTask() {
  const URL = endpoints.task.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  const refreshTasks = useCallback(() => {
    mutate(URL);
  }, [URL]);

  return useMemo(
    () => ({
      tasks: data || [],
      tasksLoading: isLoading,
      tasksError: error,
      tasksValidating: isValidating,
      tasksEmpty: !isLoading && !data?.data?.length,
      refreshTasks,
    }),
    [data, error, isLoading, isValidating, refreshTasks]
  );
}


// ----------------------------------------------------------------------

export function useUpdateTaskStatus() {
  const updateTaskStatus = useCallback(async (taskId, { statusType, description, newIssues }) => {
    const URL = `${endpoints.task.list}/update-task-status/${taskId}`;
    try {
      const response = await fetcher(URL, {
        method: 'PUT', // Assuming PUT for updates
        data: { statusType, description, newIssues },
      });
      mutate(`${endpoints.task.list}/housekeeper/${taskId.split('/')[1]}`); // Refresh housekeeper tasks
      return response;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  }, []);

  return { mutate: updateTaskStatus, isLoading: false, error: null }; // Simplified return for mutation
}

// ----------------------------------------------------------------------

export function useMarkAsCleaned() {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const markAsCleaned = useCallback(
    async (taskId) => {
      const URL = `${endpoints.task.list}/mark-as-cleaned/${taskId}`;
      console.log('Sending PUT request to:', URL, 'with taskId:', taskId);
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetcher([
          URL,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ]);
        await Promise.all([
          mutate(endpoints.task.list),
          mutate(`${endpoints.task.list}/housekeeper/${taskId}`),
        ]);
        enqueueSnackbar('Task status toggled successfully!', { variant: 'success' });
        return response;
      } catch (err) {
        console.error('Mark as cleaned error:', err);
        setError(err);
        enqueueSnackbar('Failed to toggle task status', { variant: 'error' });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  return { markAsCleaned, isLoading, error };
}

// ----------------------------------------------------------------------

export function useDeleteTask(taskId) {
  const URL = `${endpoints.task.list}/${taskId}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  const refreshTasks = useCallback(() => {
    mutate(URL);
  }, [URL]);

  return useMemo(
    () => ({
      tasks: data || [],
      tasksLoading: isLoading,
      tasksError: error,
      tasksValidating: isValidating,
      tasksEmpty: !isLoading && !data?.data?.length,
      refreshTasks,
    }),
    [data, error, isLoading, isValidating, refreshTasks]
  );
}
