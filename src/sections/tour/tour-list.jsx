/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import TourItem from './tour-item';

// ----------------------------------------------------------------------

export default function TourList({ tours, refreshRooms }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.room.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id) => {
      router.push(paths.dashboard.room.edit(id));
    },
    [router]
  );

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/room/${id}`);
      enqueueSnackbar('Deleted Successfully!');
      refreshRooms();
      // console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {tours.map((tour) => (
          <TourItem
            key={tour.id}
            tour={tour}
            onView={() => handleView(tour._id)}
            onEdit={() => handleEdit(tour._id)}
            onDelete={() => handleDelete(tour._id)}
          />
        ))}
      </Box>

      {tours.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

TourList.propTypes = {
  tours: PropTypes.array,
  refreshRooms: PropTypes.any,
};
