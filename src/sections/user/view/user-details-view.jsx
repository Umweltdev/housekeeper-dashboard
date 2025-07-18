/* eslint-disable spaced-comment */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { paths } from 'src/routes/paths';

import axiosInstance from 'src/utils/axios';

import { useGetUser } from 'src/api/user';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserBookingTable from './user-booking-table';

export default function UserDetailsView({ id }) {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar(); // For notifications

  const { user: currentUser } = useGetUser(id);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Dialog state

  const handleDeleteUser = async () => {
    try {
      // Call the API to delete the user
      await axiosInstance.delete(`/api/user/${id}`);

      // Show success notification
      enqueueSnackbar('User deleted successfully', { variant: 'success' });

      // Optionally redirect or refresh the page
      window.location.href = paths.dashboard.user.root; // Redirect to user list
    } catch (error) {
      console.error(error);

      // Show error notification
      enqueueSnackbar('User deleted successfully.', { variant: 'success' });
    } finally {
      setOpenConfirmDialog(false); // Close the dialog
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentUser?.firstName}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: currentUser?.firstName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Label
              color={
                (currentUser?.status === 'active' && 'success') ||
                (currentUser?.status === 'banned' && 'error') ||
                'warning'
              }
              sx={{ position: 'absolute', top: 24, right: 24 }}
            >
              {currentUser?.status}
            </Label>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <img
                src={
                  currentUser?.img?.preview ||
                  currentUser?.img ||
                  '/assets/illustrations/avatar.png'
                }
                alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
                style={{ width: '120px', height: '120px', borderRadius: '50%' }}
              />
              <Box
                sx={{ mt: 2, display: 'flex', gap: 1, margin: 'auto', justifyContent: 'center' }}
              >
                <Typography variant="h6">{currentUser?.firstName}</Typography>
                <Typography variant="h6">{currentUser?.lastName}</Typography>
              </Box>
              {/* <Typography
                variant="caption"
                sx={{ display: 'block', mt: 2, color: 'text.secondary' }}
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif
                <br /> max size of {fData(3145728)}
              </Typography> */}
            </Box>
            {/* <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
              <Button
                variant="soft"
                color="error"
                onClick={() => setOpenConfirmDialog(true)} // Open the confirmation dialog
              >
                Delete User
              </Button>
            </Stack> */}
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Box>
                <Typography variant="subtitle2">First Name</Typography>
                <Typography variant="body2">{currentUser?.firstName}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Last Name</Typography>
                <Typography variant="body2">{currentUser?.lastName}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Email Address</Typography>
                <Typography variant="body2">{currentUser?.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Phone Number</Typography>
                <Typography variant="body2">{currentUser?.phone}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Country</Typography>
                <Typography variant="body2">{currentUser?.country}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">City</Typography>
                <Typography variant="body2">{currentUser?.city}</Typography>
              </Box>
            </Box>
          </Card>
          <Box>
            <Typography variant="h6" mt={3}>
              Booking History
            </Typography>
          </Box>
          <UserBookingTable id={id} />
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {currentUser?.firstName} {currentUser?.lastName}? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error" autoFocus>
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
