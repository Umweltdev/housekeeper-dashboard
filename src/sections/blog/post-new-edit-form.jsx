import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';
import { fData } from 'src/utils/format-number';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFUploadAvatar,
} from 'src/components/hook-form';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function PostNewEditForm({ currentUser }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    status: Yup.string().required('Status is required').oneOf(["Checked-Out", "Checked-in", "Reserved"], 'Invalid status'),
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
      

      // Room Details (now an array of rooms)
      rooms: currentUser?.rooms?.map((room) => ({
        roomNumber: room?.roomId?.roomNumber || '',
        roomType: room?.roomId?.roomType?.title || '',
        floor: room?.roomId?.floor || '',
        amount: room?.roomId?.roomType?.price || '',
        roomImg: room?.roomId?.roomType?.images[0] || null,
        checkIn: room?.checkIn || room?.roomId?.checkIn || '', // Check both places
        checkOut: room?.checkOut || room?.roomId?.checkOut || '', // Check both places
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
 
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="img"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
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

            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>First Name:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{values.firstName || 'N/A'}</Typography>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>Last Name:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{values.lastName || 'N/A'}</Typography>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>Email Address:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{values.email || 'N/A'}</Typography>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>Phone Number:</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{values.phone || 'N/A'}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 5 }}>
              {/* Render multiple rooms */}
              {values.rooms?.map((room, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box
                    component="img"
                    src={room?.roomImg || '/assets/images/default-room.jpg'}
                    alt="Room Image"
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Room Image
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Room Number:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{room?.roomNumber || 'N/A'}</Typography>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Room Type:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{room?.roomType || 'N/A'}</Typography>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Check-In:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(room?.checkIn)}</Typography>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Check-Out:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(room?.checkOut)}</Typography>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Amount:</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{room?.amount?.toLocaleString() || 'N/A'}</Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

PostNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};