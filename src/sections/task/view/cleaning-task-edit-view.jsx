import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Grid,
  Paper,
  Stack,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Chip,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

const STATUS_OPTIONS = ['dirty', 'cleaned']; // Only allow switching between these
const STATUS_COLORS = {
  dirty: 'error',
  cleaned: 'success',
  inspected: 'info',
};

const PRIORITY_COLORS = {
  High: 'error',
  Medium: 'warning',
  Low: 'default',
};

export default function CleaningTaskEditForm({ task }) {
  const [issues, setIssues] = useState(task.maintenanceAndDamages || []);
  const [newIssue, setNewIssue] = useState('');
  const [status, setStatus] = useState(task.status);

  const isStatusEditable = status === 'dirty' || status === 'cleaned';

  const handleAddIssue = () => {
    if (newIssue.trim()) {
      setIssues([...issues, { id: Date.now().toString(), description: newIssue }]);
      setNewIssue('');
    }
  };

  const handleRemoveIssue = (id) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Room Status Edit */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h2">
                Room #{task.room}
              </Typography>

              <Label
                variant="soft"
                color={STATUS_COLORS[task.status] || 'default'}
                sx={{ textTransform: 'capitalize' }}
              >
                {task.status}
              </Label>

              <Label
                variant="soft"
                color={PRIORITY_COLORS[task.priority] || 'default'}
                sx={{ textTransform: 'capitalize' }}
              >
                {task.priority} Priority
              </Label>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Room #{task.room} - {task.category}
              </Typography>

              <TextField
                label="Room Category"
                value={task.category}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Description"
                value={task.description}
                multiline
                rows={3}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Due Date"
                value={new Date(task.dueDate).toISOString().split('T')[0]}
                type="date"
                fullWidth
                InputProps={{ readOnly: true }}
              />

              {/* Priority with Label */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <TextField
                  label="Priority"
                  value={task.priority}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <Chip
                  label={task.priority}
                  color={PRIORITY_COLORS[task.priority]}
                  size="small"
                  variant="soft"
                />
              </Stack>

              {/* Cleaning Status with logic */}
              {isStatusEditable ? (
                <TextField
                  label="Cleaning Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  select
                  fullWidth
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TextField
                    label="Cleaning Status"
                    value={status}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <Chip label={status} color={STATUS_COLORS[status]} size="small" variant="soft" />
                </Stack>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Maintenance & Damages */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Maintenance & Damages
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <TextField
                fullWidth
                placeholder="e.g., Leaky faucet in bathroom"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
              />
              <Button onClick={handleAddIssue} variant="contained">
                Add
              </Button>
            </Stack>

            <Stack spacing={1}>
              {issues.map((issue) => (
                <Paper
                  key={issue.id}
                  variant="outlined"
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2">{issue.description}</Typography>
                  <IconButton size="small" onClick={() => handleRemoveIssue(issue.id)}>
                    <Iconify icon="eva:close-fill" />
                  </IconButton>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer Buttons */}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
        <Button variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}

CleaningTaskEditForm.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    maintenanceAndDamages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }).isRequired,
};
