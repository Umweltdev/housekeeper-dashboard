import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Typography,
  Button,
  Divider,
  Paper,
  IconButton,
  Grid,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import Iconify from 'src/components/iconify';

export default function CleaningTaskEditForm({ task }) {
  const [issues, setIssues] = useState(task.maintenanceAndDamages || []);
  const [newIssue, setNewIssue] = useState('');

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
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Room Status Edit
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <TextField
                label={`Room #${task.room} - ${task.category}`}
                value={task.status}
                fullWidth
                disabled
              />

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

              <TextField
                label="Priority"
                value={task.priority}
                fullWidth
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Cleaning Status"
                value={task.status}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Stack>
          </Paper>
        </Grid>

        {/* Maintenance & Damages */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
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
        <Button variant="contained" color="success">
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
