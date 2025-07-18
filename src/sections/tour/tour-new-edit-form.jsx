/* eslint-disable perfectionist/sort-imports */
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';
import Chip from '@mui/material/Chip';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import axiosInstance from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TourNewEditForm({ currentTour }) {
  console.log(currentTour)
  const [newRoomNumber, setNewRoomNumber] = useState('');

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewTourSchema = Yup.object().shape({
    title: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    images: Yup.array().min(1, 'Images is required'),
    price: Yup.string().required('Price is required'),
    maxPeople: Yup.string().required('Maximum People is required'),
    roomNumber: Yup.string().required('Room Number is required'),
   
  });

  const defaultValues = useMemo(
    () => ({
      title: currentTour?.title || '',
      description: currentTour?.description || '',
      images: currentTour?.images || [],
      price: currentTour?.price || '',
      maxPeople: currentTour?.maxPeople || '',
      roomNumber: currentTour?.roomNumber || [],
      publish: currentTour?.publish === 'published',

      //
      // tourGuides: currentTour?.tourGuides || [],
      // tags: currentTour?.tags || [],
      // durations: currentTour?.durations || '',
      // destination: currentTour?.destination || '',
      // services: currentTour?.services || [],
      // available: {
      //   startDate: currentTour?.available.startDate || null,
      //   endDate: currentTour?.available.endDate || null,
      // },
    }),
    [currentTour]
  );

  const methods = useForm({
    resolver: yupResolver(NewTourSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentTour) {
      reset(defaultValues);
    }
  }, [currentTour, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    // try {
    //   if (currentTour) {
    //     await axiosInstance.put(`/api/room/${currentTour._id}`, data);
    //   } else {
    //     await axiosInstance.post(`/api/room`, data);
    //   }
    //   reset();
    //   enqueueSnackbar(currentTour ? 'Update success!' : 'Create success!');
    //   router.push(paths.dashboard.room.root);
    // } catch (error) {
    //   console.error(error);
    // }

    try {
      const transformedData = {
        ...data,
        publish: data.publish ? 'published' : 'draft', // Convert boolean to string
      };
      const formData = new FormData();
      Object.keys(transformedData).forEach((key) => {
        if (key !== 'images') {
          formData.append(key, transformedData[key]);
        }
      });
      transformedData.images.forEach((image, index) => {
        if (typeof image === 'string') {
          formData.append(`previousImages[${index}]`, JSON.stringify(image));
        } else {
          formData.append(`images`, image);
        }
      });

      if (currentTour) {
        await axiosInstance.put(`/api/room-type/${currentTour._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axiosInstance.post(`/api/room-type`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      reset();
      enqueueSnackbar(currentTour ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.room.root);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('images', [...files, ...newFiles], {
        shouldValidate: true,
      });
    },
    [setValue, values.images]
  );

  const handleAddRoom = () => {
    if (newRoomNumber.trim() && !values.roomNumber.includes(newRoomNumber.trim())) {
      setValue('roomNumber', [...values.roomNumber, newRoomNumber.trim()]);
      setNewRoomNumber('');
    }
  };
  
  const handleRemoveRoom = (roomToRemove) => {
    setValue('roomNumber', values.roomNumber.filter((roomNumb) => roomNumb !== roomToRemove));
  };

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Title</Typography>
              <RHFTextField name="title" placeholder="Title" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFEditor simple name="description" />
            </Stack>

            <Stack flexDirection="row" justifyContent="space-between" flexWrap="wrap">
              <Stack>
                <Typography variant="subtitle2">Room Price</Typography>
                <RHFTextField name="price" placeholder="Room Price" />
              </Stack>
              {/* <Stack>
                <Typography variant="subtitle2">Room Number</Typography>
                <RHFTextField name="roomNumber" placeholder="Room Number" />
              </Stack> */}
              {/* <Stack>
                <Typography variant="subtitle2">Room Type</Typography>
                <RHFTextField name="roomType" placeholder="Room Type" />
              </Stack> */}
              <Stack>
                <Typography variant="subtitle2">Max People</Typography>
                <RHFTextField name="maxPeople" placeholder="Maximum People" />
              </Stack>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderRoomNumbers = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Room Numbers
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Rooms under Room Types
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Room Numbers" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Add Room Number"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRoom();
                  }
                }}
              />
              <LoadingButton
                variant="contained"
                onClick={handleAddRoom}
                disabled={!newRoomNumber.trim()}
              >
                Add
              </LoadingButton>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {values.roomNumber.map((roomNumb, index) => (
                <Chip
                  key={index}
                  label={roomNumb}
                  onDelete={() => handleRemoveRoom(roomNumb)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, pl: 3 }}>
          <RHFSwitch name="publish" label="Publish" />
        </Box>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentTour ? 'Create Room' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderRoomNumbers}
        {/* {renderProperties} */}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

TourNewEditForm.propTypes = {
  currentTour: PropTypes.object,
};
