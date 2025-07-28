/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Divider,
  Grid,
  TextField,
  Button,
  Paper,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import axiosInstance from 'src/utils/axios';
import makeToast from './assets/toaster';

const CheckoutPage = ({ roomDetails, additionalCharges }) => {
  const location = useLocation();
  const [room, setRoom] = useState(roomDetails || {});
  const [checkInDate, setCheckInDate] = useState(roomDetails.checkInDate || '');
  const [checkOutDate, setCheckOutDate] = useState(roomDetails.checkOutDate || '');
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(additionalCharges || 0);
  const [nights, setNights] = useState(0);
  const isNonMobile = useMediaQuery('(min-width:750px)');

  console.log(room);

  console.log('Room Details:', roomDetails);
  console.log('Room ID:', room._id);
  console.log('Check-In Date:', checkInDate);
  console.log('Check-Out Date:', checkOutDate);

  useEffect(() => {
    if (checkInDate && checkOutDate && room.price) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const calculatedNights = Math.max((checkOut - checkIn) / (1000 * 60 * 60 * 24), 0);
      setNights(calculatedNights);
      setTotalPrice(additionalCharges);
    }
  }, [checkInDate, checkOutDate, room.price, additionalCharges]);

  const handleBooking = async (values) => {
    try {
      if (!room._id || !checkInDate || !checkOutDate) {
        makeToast('error', 'Room information is incomplete, please try again.');
        return;
      }

      setLoading(true);

      const payload = {
        customer: {
          name: values.name,
          email: values.email,
          phoneNumber: values.phone,
          fullAddress: values.address,
        },
        rooms: [
          {
            roomId: room._id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
          },
        ],
        totalPrice,
      };

      const response = await axiosInstance.post(`/api/booking`, payload);
      const { paystackUrl } = response.data;

      // if (unavailableRooms?.length) {
      //   makeToast('error', 'Some rooms are unavailable, please try again.');
      //   return;
      // }

      window.location.href = paystackUrl;
    } catch (error) {
      makeToast(
        'error',
        error?.response?.data?.message || 'Failed to book room, please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

  const bookingSchema = yup.object().shape({
    phone: yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    name: yup.string().required('Required'),
    address: yup.string().required('Required'),
  });

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ py: 4 }}>
      {/* Room Details */}
      <Grid item xs={12} md={5}>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box
            component="img"
            src={room.roomImg || '/placeholder.png'}
            alt={room.roomName}
            sx={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
            }}
          />
          <Box p={3}>
            <Typography variant="h6">{room.roomName}</Typography>
            <br />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <TextField
                type="date"
                label="Check-In Date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                fullWidth
              />
              <br />
              <TextField
                type="date"
                label="Check-Out Date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <br />
              Number of Nights: {nights}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">Room: {room.roomNumber}</Typography>
            <Typography variant="body2">
              Price per Night: ₦{room.price?.toLocaleString()}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Total Price: ₦{totalPrice.toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={7}>
        <Paper elevation={3} sx={{ borderRadius: 2, p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Confirm Your Booking
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={bookingSchema}
            onSubmit={handleBooking}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    fullWidth
                  />
                  <TextField
                    label="Email Address"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                  />
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    fullWidth
                  />
                  <TextField
                    label="Full Address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                    fullWidth
                  />
                </Stack>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, py: 1.5, fontSize: 16 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
                </Button>
              </form>
            )}
          </Formik>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CheckoutPage;