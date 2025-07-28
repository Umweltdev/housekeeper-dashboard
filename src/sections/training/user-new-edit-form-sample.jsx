import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

// Material UI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

// Custom Components
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';
import { fData } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import CheckoutPage from './CheckoutPage';
import makeToast from '../tour/assets/toaster';

export default function UserNewEditFormSample({ currentUser }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [additionalCharges, setAdditionalCharges] = useState(0);

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    status: Yup.string()
      .required('Status is required')
      .oneOf(['Checked-Out', 'Checked-in', 'Reserved'], 'Invalid status'),
    additionalCharges: Yup.number()
      .typeError('Additional charges must be a number')
      .min(0, 'Additional charges cannot be negative')
      .nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.customer?.firstName || '',
      lastName: currentUser?.customer?.lastName || '',
      city: currentUser?.city || '',
      email: currentUser?.customer?.email || '',
      country: currentUser?.country || '',
      img: currentUser?.customer?.img || null,
      phone: currentUser?.customer?.phone || '',
      status: currentUser?.status || 'Checked-Out',
      rooms:
        currentUser?.rooms?.map((room) => ({
          roomNumber: room?.roomId?.roomNumber || '',
          roomType: room?.roomId?.roomType?.title || '',
          floor: room?.roomId?.floor || '',
          amount: room?.roomId?.roomType?.price || '',
          roomImg: room?.roomId?.roomType?.images[0] || null,
        })) || [],
      additionalCharges: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentUser) {
      reset(defaultValues);
    }
  }, [currentUser, defaultValues, reset]);

  const handleAdditionalChargesChange = (event) => {
    setAdditionalCharges(event.target.value);
  };

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    try {
      if (currentUser) {
        await axiosInstance.put(`/api/user/${currentUser._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axiosInstance.post(`/api/auth/register`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      reset();
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.root);
    } catch (error) {
      console.error(error);
    }
  });

  const onDelete = async () => {
    try {
      await axiosInstance.delete(`/api/user/${currentUser._id}`);
      enqueueSnackbar('Deleted Successfully!');
      router.push(paths.dashboard.user.root);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('img', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleCheckIn = async () => {
    try {
      if (!currentUser?._id) {
        console.log('error', 'No booking ID found.');
        return;
      }

      await axiosInstance.put(`/api/booking/${currentUser._id}`, {
        status: 'checkedIn',
      });

      enqueueSnackbar('Booking status updated to checked-in!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to update booking status.', { variant: 'error' });
    }
  };

  const handleOpenCheckoutModal = async () => {
    await handleCheckIn();

    if (!additionalCharges || additionalCharges <= 0) {
      makeToast('success', 'Customer successfully checked in');
      return;
    }

    setRoomDetails({
      roomName: values.rooms[0]?.roomType || '',
      roomNumber: values.rooms[0]?.roomNumber || '',
      roomImg: values.rooms[0]?.roomImg || '',
      price: values.rooms[0]?.amount || 0,
      checkInDate: new Date().toISOString().split('T')[0],
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split('T')[0],
    });
    setOpenCheckoutModal(true);
  };

  const handleCloseCheckoutModal = () => {
    setOpenCheckoutModal(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'checked-in':
        return 'success';
      case 'reserved':
        return 'warning';
      case 'checked-out':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Left Column - User Details */}
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {currentUser && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Chip
                  label={values.status}
                  color={getStatusColor(values.status)}
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <RHFUploadAvatar
                name="img"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <RHFTextField name="firstName" label="First Name" fullWidth />
              </Grid>
              <Grid xs={12} sm={6}>
                <RHFTextField name="lastName" label="Last Name" fullWidth />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="email" label="Email Address" fullWidth />
              </Grid>
              <Grid xs={12}>
                <RHFTextField name="phone" label="Phone Number" fullWidth />
              </Grid>
            </Grid>

            {currentUser && (
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={onDelete}
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                >
                  Delete
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  startIcon={<Iconify icon="eva:save-fill" />}
                >
                  Save Changes
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>

        {/* Right Column - Room Details */}
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {values.rooms?.map((room, index) => (
              <Paper key={index} sx={{ p: 2, mb: 3, borderRadius: 1 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    src={room?.roomImg || '/assets/images/default-room.jpg'}
                    variant="rounded"
                    sx={{ width: 80, height: 80 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {room?.roomType || 'N/A'}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Room No:
                        </Typography>
                        <Typography variant="body1">{room?.roomNumber || 'N/A'}</Typography>
                      </Grid>
                      <Grid xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Price:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          ₦{room?.amount?.toLocaleString() || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Floor:
                        </Typography>
                        <Typography variant="body1">{room?.floor || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Paper>
            ))}

            <TextField
              label="Additional Charges"
              type="number"
              value={additionalCharges}
              onChange={handleAdditionalChargesChange}
              fullWidth
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    ₦
                  </Typography>
                ),
              }}
            />

            <LoadingButton
              fullWidth
              size="large"
              type="button"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              onClick={handleOpenCheckoutModal}
              startIcon={<Iconify icon="eva:checkmark-circle-2-outline" />}
            >
              Check-In Gues t
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>

      {/* Checkout Modal */}
      <Dialog
        open={openCheckoutModal}
        onClose={handleCloseCheckoutModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <CheckoutPage roomDetails={roomDetails} additionalCharges={additionalCharges} />
      </Dialog>
    </FormProvider>
  );
}

UserNewEditFormSample.propTypes = {
  currentUser: PropTypes.object,
};
