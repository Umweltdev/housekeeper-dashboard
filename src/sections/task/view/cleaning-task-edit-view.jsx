import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';

import {
  Box,
  Grid,
  Chip,
  Card,
  Paper,
  Stack,
  Alert,
  Button,
  Avatar,
  Divider,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
  IconButton,
  CardContent,
  CircularProgress,
} from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { endpoints } from 'src/utils/axios';

const STATUS_OPTIONS = ['dirty', 'cleaned'];
const STATUS_COLORS = {
  dirty: 'error',
  cleaned: 'success',
  inspected: 'info',
};
const MAINTENANCE_PRIORITIES = ['low', 'medium', 'high'];
const PRIORITY_COLORS = {
  low: 'info',
  medium: 'warning',
  high: 'error',
};

export default function CleaningTaskEditForm({ task, onSave, isSaving }) {
  const navigate = useNavigate();
  const [issues, setIssues] = useState(
    task.status.maintenanceAndDamages.map((item) => ({
      id: item._id || Date.now().toString(),
      description: item.issue,
      priority: item.issuePriority,
      date: item.reportedAt,
    })) || []
  );
  const [newIssue, setNewIssue] = useState('');
  const [newIssuePriority, setNewIssuePriority] = useState('medium');
  const [status, setStatus] = useState(task.status.statusType || 'dirty');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(null);

  const isStatusEditable = status === 'dirty' || status === 'cleaned';

  const handleAddIssue = () => {
    if (newIssue.trim() && MAINTENANCE_PRIORITIES.includes(newIssuePriority)) {
      const newIssueObj = {
        id: Date.now().toString(),
        description: newIssue,
        priority: newIssuePriority,
        date: new Date().toISOString(),
      };
      setIssues([...issues, newIssueObj]);
      setNewIssue('');
      setNewIssuePriority('medium');
    }
  };

  const handleRemoveIssue = (id) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
  };

  const handlePriorityChange = (id, currentPriority) => {
    const currentIndex = MAINTENANCE_PRIORITIES.indexOf(currentPriority);
    const nextPriority = MAINTENANCE_PRIORITIES[(currentIndex + 1) % MAINTENANCE_PRIORITIES.length];
    setIssues((prev) =>
      prev.map((issue) => (issue.id === id ? { ...issue, priority: nextPriority } : issue))
    );
  };

  const handleSaveChanges = async () => {
    try {
      await onSave(task._id, {
        status,
        issues,
      });
      // Trigger a global refresh of the task list
      await mutate(endpoints.task.list, undefined, { revalidate: true });
      await mutate(`${endpoints.task.list}/housekeeper/${task.housekeeperId}`, undefined, {
        revalidate: true,
      });
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate(paths.dashboard.task.root);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save changes');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Room Info (Left) */}
        <Grid item xs={12} md={6} sx={{ maxHeight: 1000, overflowY: 'auto' }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h2">
                Room #{task.roomId?.roomNumber || 'N/A'}
              </Typography>

              <Label
                variant="soft"
                color={STATUS_COLORS[status] || 'default'}
                sx={{ textTransform: 'capitalize' }}
              >
                {status}
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
              <TextField
                label="Room Category"
                value={task.roomId?.roomType?.title || 'Unknown'}
                fullWidth
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Description"
                value={task.status?.description || 'No description'}
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

        {/* Issues Section (Right) */}
        <Grid item xs={12} md={6} sx={{ maxHeight: 550 }}>
          <Card
            elevation={3}
            sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <CardContent
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Iconify icon="material-symbols:home-repair-service" />
                </Avatar>
                <Typography variant="h5" component="h2">
                  Room Issues & Repairs
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary" mb={3}>
                Report and track maintenance issues, damages, or required repairs for this room.
              </Typography>

              <Stack direction="row" spacing={1} alignItems="flex-start" mb={2}>
                <TextField
                  fullWidth
                  placeholder="e.g., Leaky faucet, broken tile, malfunctioning AC"
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  size="small"
                  inputProps={{ maxLength: 100 }}
                  helperText={`${newIssue.length}/100 characters`}
                />
                <TextField
                  select
                  value={newIssuePriority}
                  onChange={(e) => setNewIssuePriority(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  {MAINTENANCE_PRIORITIES.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  onClick={handleAddIssue}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  disabled={!newIssue.trim() || isSaving}
                >
                  Add Issue
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <Stack spacing={2}>
                  {issues.length > 0 ? (
                    issues.map((issue) => (
                      <Card key={issue.id} variant="outlined" sx={{ p: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box sx={{ maxWidth: '70%' }}>
                            <Typography variant="subtitle2" noWrap>
                              {issue.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Reported: {new Date(issue.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                              size="small"
                              variant="outlined"
                              color={PRIORITY_COLORS[issue.priority] || 'primary'}
                              onClick={() => handlePriorityChange(issue.id, issue.priority)}
                              startIcon={
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: (theme) =>
                                      theme.palette[PRIORITY_COLORS[issue.priority] || 'primary']
                                        .main,
                                  }}
                                />
                              }
                            >
                              {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveIssue(issue.id)}
                              color="error"
                              disabled={isSaving}
                            >
                              <Iconify icon="eva:trash-2-outline" width={18} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Card>
                    ))
                  ) : (
                    <Box textAlign="center" py={3}>
                      <Iconify
                        icon="mdi:clipboard-check-outline"
                        width={48}
                        sx={{ opacity: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        No issues reported for this room
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="eva:close-fill" />}
          onClick={() => navigate(paths.dashboard.task.root)}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          startIcon={
            isSaving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Iconify icon="eva:save-fill" />
            )
          }
          disabled={isSaving}
          sx={{ minWidth: 140 }}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || 'Changes saved successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

CleaningTaskEditForm.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    housekeeperId: PropTypes.string.isRequired,
    roomId: PropTypes.shape({
      roomNumber: PropTypes.string.isRequired,
      roomType: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
      }),
    }).isRequired,
    status: PropTypes.shape({
      statusType: PropTypes.string.isRequired,
      description: PropTypes.string,
      maintenanceAndDamages: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          issue: PropTypes.string,
          issuePriority: PropTypes.string,
          reportedAt: PropTypes.string,
        })
      ),
      detailedIssues: PropTypes.array,
    }).isRequired,
    dueDate: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};
