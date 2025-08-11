import { Alert, CircularProgress, Container } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { useGetTask, useUpdateTask } from 'src/api/task';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { endpoints } from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CleaningTaskEditForm from './cleaning-task-edit-view';

export default function TaskEditView({ id }) {
  const settings = useSettingsContext();
  const { task, taskLoading, taskError } = useGetTask(id);
  const { mutate: updateTask, isLoading } = useUpdateTask(id);

  const handleSave = useCallback(
    async (taskId, data) => {
      try {
        const updatedTask = {
          roomId: task.roomId?._id || task.roomId,
          housekeeperId: task.housekeeperId,
          dueDate: task.dueDate,
          priority: task.priority,
          status: {
            statusType: data.status,
            description: task.status?.description || '',
            maintenanceAndDamages: data.issues.map((issue) => ({
              issue: issue.description,
              issuePriority: issue.priority,
              reportedAt: issue.date,
            })),
            detailedIssues: task.status?.detailedIssues || [],
          },
        };
        await updateTask(updatedTask, task.housekeeperId);
      } catch (error) {
        console.error('Update failed:', error);
        throw error;
      }
    },
    [updateTask, task]
  );

  if (taskLoading) return <CircularProgress />;
  if (taskError) return <Alert severity="error">Error loading task: {taskError.message}</Alert>;
  if (!task) return <Alert severity="warning">Task not found</Alert>;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Task Update"
        links={[
          { name: 'Dashboard', href: paths.dashboard.task.list },
          { name: 'Task List', href: paths.dashboard.task.root },
          { name: 'Task Update' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <CleaningTaskEditForm task={task} onSave={handleSave} isSaving={isLoading} />
    </Container>
  );
}

TaskEditView.propTypes = {
  id: PropTypes.string.isRequired,
};
