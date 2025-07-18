import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

// Material UI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

// Custom Components
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';
import { fData } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

export default function UserNewEditForm({ currentUser, onClose }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const statusOptions = ['open', 'in-progress', 'resolved', 'closed'];
  const priorityOptions = ['low', 'medium', 'high'];
  const categoryOptions = ['billing', 'service', 'facilities', 'other'];

  const ComplaintSchema = Yup.object().shape({
  user: Yup.string().required('User is required'),
  email: Yup.string().required('Email is required').email('Email must be valid'),
  subject: Yup.string().required('Subject is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().required('Status is required').oneOf(statusOptions),
  priority: Yup.string().required('Priority is required').oneOf(priorityOptions),
  category: Yup.string().required('Category is required').oneOf(categoryOptions),
});

  const defaultValues = useMemo(
  () => ({
    user: currentUser?.user || '',
    email: currentUser?.email || '',
    subject: currentUser?.subject || '',
    description: currentUser?.description || '',
    status: currentUser?.status || 'open',
    priority: currentUser?.priority || 'medium',
    category: currentUser?.category || 'other',
    images: currentUser?.images || [],
  }),
  [currentUser]
);

  const methods = useForm({
    resolver: yupResolver(ComplaintSchema),
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
    try {
      if (currentUser) {
        await axiosInstance.put(`/api/complaints/${currentUser._id}`, data);
        enqueueSnackbar('Complaint updated successfully!');
      } else {
        await axiosInstance.post(`/api/complaints`, data);
        enqueueSnackbar('Complaint created successfully!');
      }
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message || 'An error occurred', { variant: 'error' });
    }
  });

  const onDelete = async () => {
    try {
      await axiosInstance.delete(`/api/complaints/${currentUser._id}`);
      enqueueSnackbar('Complaint deleted successfully!');
      router.push(paths.dashboard.complaint.root);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if (files.length > 0) {
        setValue('images', [...values.images, ...files], { shouldValidate: true });
      }
    },
    [setValue, values.images]
  );

  const removeImage = (index) => {
    const newImages = [...values.images];
    newImages.splice(index, 1);
    setValue('images', newImages);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in-progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Left Column - Complaint Details */}
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Complaint Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {currentUser && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Chip
                  label={values.status}
                  color={getStatusColor(values.status)}
                  size="small"
                />
                <Chip
                  label={values.priority}
                  color={getPriorityColor(values.priority)}
                  size="small"
                />
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid xs={12}>
    <RHFTextField name="user" label="User" fullWidth />
  </Grid>
  <Grid xs={12}>
    <RHFTextField name="email" label="Email" fullWidth />
  </Grid>
              <Grid xs={12}>
                <RHFTextField name="subject" label="Subject" fullWidth />
              </Grid>
              <Grid xs={12}>
                <RHFTextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <RHFAutocomplete
                  name="status"
                  label="Status"
                  options={statusOptions}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <RHFAutocomplete
                  name="priority"
                  label="Priority"
                  options={priorityOptions}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </Grid>
              <Grid xs={12}>
                <RHFAutocomplete
                  name="category"
                  label="Category"
                  options={categoryOptions}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Right Column - Images and Actions */}
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Attachments
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <RHFUploadAvatar
                name="images"
                multiple
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
              {values.images?.map((image, index) => (
                <Grid key={index} xs={6} sm={4}>
                  <Paper sx={{ p: 1, position: 'relative' }}>
                    <Avatar
                      src={typeof image === 'string' ? image : image.preview}
                      variant="rounded"
                      sx={{ width: '100%', height: 100 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'background.paper',
                        '&:hover': { backgroundColor: 'background.default' },
                      }}
                    >
                      <Iconify icon="eva:close-fill" width={16} />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                onClick={onClose}
              >
                Cancel
              </Button>
              {currentUser && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={onDelete}
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                >
                  Delete
                </Button>
              )}
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                startIcon={<Iconify icon="eva:save-fill" />}
              >
                {currentUser ? 'Update' : 'Create'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    user: PropTypes.string,
    email: PropTypes.string,
    subject: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    category: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ])),
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};