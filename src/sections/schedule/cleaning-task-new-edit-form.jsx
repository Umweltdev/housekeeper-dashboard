import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { Box, Card, Stack, Button, Divider, MenuItem, TextField, Typography } from '@mui/material';

const statusOptions = ['pending', 'completed', 'cancelled'];
const priorityOptions = ['Low', 'Medium', 'High'];

export default function CleaningTaskEditForm({ task }) {
  const navigate = useNavigate();

  const [status, setStatus] = useState(task?.status || 'pending');
  const [priority, setPriority] = useState(task?.priority || 'Low');
  const [issues, setIssues] = useState(
    Array.isArray(task?.maintenanceAndDamages) ? task.maintenanceAndDamages : []
  );
  const [newIssue, setNewIssue] = useState('');

  if (!task) {
    return <Typography color="error">Task not found</Typography>;
  }
  const handleSave = () => {
    console.log('Saving...', {
      ...task,
      status,
      priority,
      maintenanceAndDamages: issues,
    });
    navigate('/dashboard/task');
  };

  const handleCancel = () => {
    navigate('/dashboard/task');
  };

  const handleAddIssue = () => {
    if (!newIssue.trim()) return;
    const newItem = {
      id: `custom-${Date.now()}`,
      type: 'maintenance',
      description: newIssue,
      status: 'open',
    };
    setIssues([...issues, newItem]);
    setNewIssue('');
  };

  const handleRemoveIssue = (id) => {
    setIssues(issues.filter((issue) => issue.id !== id));
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      {/* LEFT */}
      <Card sx={{ p: 3, flex: 1 }}>
        <Typography variant="h6">Room Status Edit</Typography>

        <TextField
          fullWidth
          select
          label="Cleaning Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ my: 2 }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <Typography variant="subtitle2">Room Category</Typography>
        <Typography variant="body2" gutterBottom>
          {task.category}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Description
        </Typography>
        <Typography variant="body2">{task.description}</Typography>

        <Typography variant="subtitle2" sx={{ mt: 2 }}>
          Due Date
        </Typography>
        <Typography variant="body2">
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
        </Typography>

        <TextField
          fullWidth
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          sx={{ mt: 2 }}
        >
          {priorityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Card>

      {/* RIGHT */}
      <Card sx={{ p: 3, flex: 1 }}>
        <Typography variant="h6">Maintenance & Damages</Typography>

        <TextField
          fullWidth
          label="Add New Issue"
          placeholder="e.g., Leaky faucet in bathroom"
          value={newIssue}
          onChange={(e) => setNewIssue(e.target.value)}
          sx={{ my: 2 }}
        />
        <Button variant="contained" onClick={handleAddIssue}>
          Add
        </Button>

        <Divider sx={{ my: 2 }} />

        {issues.map((issue) => (
          <Box
            key={issue.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'background.neutral',
              p: 1.5,
              borderRadius: 1,
              mb: 1,
            }}
          >
            <Typography variant="body2">{issue.description}</Typography>
            <Button size="small" color="error" onClick={() => handleRemoveIssue(issue.id)}>
              ✕
            </Button>
          </Box>
        ))}

        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSave}>
            Save Changes
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

CleaningTaskEditForm.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    priority: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    maintenanceAndDamages: PropTypes.array,
  }),
};
