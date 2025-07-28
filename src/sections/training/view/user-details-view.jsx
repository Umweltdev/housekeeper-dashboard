/* eslint-disable spaced-comment */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Dialog,
  Divider,
  MenuItem,
  TextField,
  Container,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useGetUser } from 'src/api/user';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function UserDetailsView({ id }) {
  const router = useRouter();
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { user: currentUser } = useGetUser(id);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openInventoryDialog, setOpenInventoryDialog] = useState(false);

  const [formData, setFormData] = useState({
    items: [{ item: 'Pillows', quantity: 0 }],
    reason: '',
    isLowStock: false,
  });

  const handleInputChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleReasonChange = (event) => {
    setFormData({ ...formData, reason: event.target.value });
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { item: '', quantity: 0 }],
    }));
  };

  const handleReset = () => {
    setFormData({
      items: [{ item: 'Pillows', quantity: 0 }],
      reason: '',
      isLowStock: false,
    });
  };

  const handleSubmit = async () => {
    try {
      // await axiosInstance.post('/api/inventory/request', {
      //   userId: id,
      //   ...formData,
      // });
      enqueueSnackbar('Inventory request submitted successfully', { variant: 'success' });
      handleReset();
      setOpenInventoryDialog(false);

      router.push(paths.dashboard.inventory.root);
    } catch (error) {
      enqueueSnackbar('Failed to submit inventory request', { variant: 'error' });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axiosInstance.delete(`/api/user/${id}`);
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
      window.location.href = paths.dashboard.user.root;
    } catch (error) {
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
    } finally {
      setOpenConfirmDialog(false);
    }
  };

  const isItemValid = (item) => item.item.trim() !== '' && Number(item.quantity) > 0;
  const hasValidItems = formData.items.some(isItemValid);
  const lastItem = formData.items[formData.items.length - 1];
  const canAddMore = lastItem ? isItemValid(lastItem) : true;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Inventory Request"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Inventory', href: paths.dashboard.inventory.root },
          { name: 'Request', href: '' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={4}>
        {/* Left: Form Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4, boxShadow: 3 }}>
            <Stack spacing={3}>
              {formData.items.map((item, index) => (
                <Stack
                  key={index}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems="center"
                >
                  <TextField
                    select
                    fullWidth
                    label="Item"
                    value={item.item}
                    onChange={(e) => handleInputChange(index, 'item', e.target.value)}
                  >
                    <MenuItem value="Pillows">Pillows</MenuItem>
                    <MenuItem value="Blankets">Blankets</MenuItem>
                    <MenuItem value="Sheets">Sheets</MenuItem>
                    <MenuItem value="Towels">Towels</MenuItem>
                    <MenuItem value="Toiletries">Toiletries Kit</MenuItem>
                    <MenuItem value="Mattress Protectors">Mattress Protectors</MenuItem>
                    <MenuItem value="Pillow Cases">Pillow Cases</MenuItem>
                    <MenuItem value="Duvet Covers">Duvet Covers</MenuItem>
                    <MenuItem value="Bathrobes">Bathrobes</MenuItem>
                    <MenuItem value="Slippers">Slippers</MenuItem>
                    <MenuItem value="Shower Curtains">Shower Curtains</MenuItem>
                    <MenuItem value="Laundry Bags">Laundry Bags</MenuItem>
                    <MenuItem value="Ironing Boards">Ironing Boards</MenuItem>
                  </TextField>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleInputChange(
                          index,
                          'quantity',
                          Math.max(Number(item.quantity || 0) - 1, 0)
                        )
                      }
                      disabled={Number(item.quantity || 0) <= 0}
                      sx={{
                        border: '1px solid #ccc',
                        bgcolor: 'background.paper',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'scale(1.1)',
                          boxShadow: 2,
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                      }}
                    >
                      <Iconify icon="ic:round-remove" />
                    </IconButton>

                    <Typography
                      variant="body1"
                      sx={{
                        minWidth: 32,
                        textAlign: 'center',
                        fontWeight: 500,
                        fontSize: 18,
                      }}
                    >
                      {item.quantity || 0}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() =>
                        handleInputChange(index, 'quantity', Number(item.quantity || 0) + 1)
                      }
                      sx={{
                        border: '1px solid #ccc',
                        bgcolor: 'background.paper',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'scale(1.1)',
                          boxShadow: 2,
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                      }}
                    >
                      <Iconify icon="ic:round-add" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}

              <Box>
                <Button color="primary" size="small" onClick={handleAddItem} disabled={!canAddMore}>
                  + Add Another Item
                </Button>
              </Box>

              <Divider />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reason for Request"
                value={formData.reason}
                onChange={handleReasonChange}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleReset}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenInventoryDialog(true)}
                  disabled={!hasValidItems || formData.items.length === 0}
                >
                  Submit Request
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Right: Request Preview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Request Preview
            </Typography>

            {formData.items.length === 0 ? (
              <Typography color="text.secondary">No items added yet.</Typography>
            ) : (
              <Stack spacing={2}>
                {formData.items.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{
                      p: 1.5,
                      border: '1px solid #eee',
                      borderRadius: 1.5,
                      bgcolor: 'grey.50',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2">{item.item || 'Select item'}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity || 0}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        // Prevent deleting the last item
                        if (formData.items.length === 1) return;
                        const newItems = [...formData.items];
                        newItems.splice(index, 1);
                        setFormData({ ...formData, items: newItems });
                      }}
                    >
                      <Iconify icon="ic:round-delete" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Submit Confirmation Dialog */}
      <Dialog open={openInventoryDialog} onClose={() => setOpenInventoryDialog(false)}>
        <DialogTitle>Submit Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit this inventory request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInventoryDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>
              {currentUser?.firstName} {currentUser?.lastName}
            </strong>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteUser} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

UserDetailsView.propTypes = {
  id: PropTypes.string,
};
