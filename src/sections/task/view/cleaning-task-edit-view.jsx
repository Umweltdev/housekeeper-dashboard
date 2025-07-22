import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

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

const STATUS_OPTIONS = ['dirty', 'cleaned'];
const STATUS_COLORS = {
  dirty: 'error',
  cleaned: 'success',
  inspected: 'info',
};
const MAINTENANCE_PRIORITIES = ['Low', 'Medium', 'High'];
const PRIORITY_COLORS = {
  Low: 'info',
  Medium: 'warning',
  High: 'error',
};

export default function CleaningTaskEditForm({ task }) {
  const router = useNavigate();

  const [issues, setIssues] = useState(task.maintenanceAndDamages || []);
  const [newIssue, setNewIssue] = useState('');
  const [newIssuePriority, setNewIssuePriority] = useState('Medium');
  const [status, setStatus] = useState(task.status);
  const [isSaving, setIsSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const isStatusEditable = status === 'dirty' || status === 'cleaned';

  const handleAddIssue = () => {
    if (newIssue.trim() && MAINTENANCE_PRIORITIES.includes(newIssuePriority)) {
      setIssues([
        ...issues,
        {
          id: Date.now().toString(),
          description: newIssue,
          date: new Date().toLocaleDateString(),
          priority: newIssuePriority,
        },
      ]);
      setNewIssue('');
      setNewIssuePriority('Medium');
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

  const handleSaveChanges = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setOpenSnackbar(true);

      setTimeout(() => {
        router('/dashboard/task');
      }, 1500);
    }, 1500);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Room Info */}
        <Grid item xs={12} md={6} sx={{ maxHeight: 1000, overflowY: 'auto' }}>
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

        {/* Issues Section */}
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
                      {priority}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  onClick={handleAddIssue}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  disabled={!newIssue.trim()}
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
                              Reported: {issue.date || new Date().toLocaleDateString()}
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
                              {issue.priority}
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveIssue(issue.id)}
                              color="error"
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
          onClick={() => router('/dashboard/task')}
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
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Changes saved successfully!
        </Alert>
      </Snackbar>
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
        priority: PropTypes.string,
        date: PropTypes.string,
      })
    ),
  }).isRequired,
};
