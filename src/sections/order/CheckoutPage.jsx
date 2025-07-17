/* eslint-disable */
import React, { useState, useEffect } from 'react';
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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import axiosInstance from 'src/utils/axios';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import makeToast from '../tour/assets/toaster';

const CheckoutPage = ({ roomDetails, additionalCharges }) => {
  const [room, setRoom] = useState(roomDetails?.rooms?.[0] || {});
  const [checkInDate, setCheckInDate] = useState(
    room?.checkInDate ? new Date(room.checkInDate) : null
  );
  const [checkOutDate, setCheckOutDate] = useState(
    room?.checkOutDate ? new Date(room.checkOutDate) : null
  );
  const [totalPrice, setTotalPrice] = useState(additionalCharges || 0);
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('Paystack');

  useEffect(() => {
    if (checkInDate && checkOutDate && room.price) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.max((checkOut - checkIn) / (1000 * 60 * 60 * 24), 0);
      setTotalPrice(additionalCharges);
    }
  }, [checkInDate, checkOutDate, room.price]);

  const handleBooking = async (values) => {
    setLoading(true);
    try {
      const payload = {
        customer: {
          name: values.name,
          email: values.email,
          phoneNumber: values.phone,
          fullAddress: values.address,
        },
        rooms: roomDetails.rooms.map(r => ({
          roomId: r.roomId,
          checkIn: r.checkInDate,
          checkOut: r.checkOutDate,
        })),
        totalPrice,
        paymentMode,
      };

      const response = await axiosInstance.post(`/api/booking`, payload);
      const { paystackUrl } = response.data;

      if (paymentMode === 'paystack') {
        window.location.href = paystackUrl;
      } else {
        makeToast('success', 'Booking confirmed.');
      }
    } catch (error) {
      makeToast('error', 'Failed to book room.');
    } finally {
      setLoading(false);
    }
  };

  const bookingSchema = yup.object().shape({
    name: yup.string().required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    phone: yup.string().required('Required'),
    address: yup.string().required('Required'),
  });

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ py: 1 }}>
      <Grid item xs={12} md={5}>
        <Paper elevation={3}>
          <Box component="img" src={room.images?.[0] || '/placeholder.png'} alt={room.roomName} sx={{ width: '100%', height: 200, objectFit: 'cover' }} />
          <Box p={3}>
            <Typography variant="h6">{room.roomName}, Room #{room.roomNumber}</Typography>
            <br />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Check-In Date"
                value={checkInDate}
                onChange={(newValue) => setCheckInDate(newValue ? new Date(newValue) : null)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <br /><br />
              <DatePicker
                label="Check-Out Date"
                value={checkOutDate}
                onChange={(newValue) => setCheckOutDate(newValue ? new Date(newValue) : null)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">Total Price: ₦{totalPrice.toLocaleString()}</Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={7}>
        <Paper elevation={3} sx={{ borderRadius: 2, p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Confirm Your Booking
          </Typography>
          <Formik initialValues={{ name: '', email: '', phone: '', address: '' }} validationSchema={bookingSchema} onSubmit={handleBooking}>
            {({ handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField label="Full Name" name="name" onChange={handleChange} fullWidth />
                  <TextField label="Email Address" name="email" onChange={handleChange} fullWidth />
                  <TextField label="Phone Number" name="phone" onChange={handleChange} fullWidth />
                  <TextField label="Full Address" name="address" onChange={handleChange} fullWidth />

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Payment Method
                  </Typography>
                  <RadioGroup
                    sx={{ display: 'flex', flexDirection: 'row' }}
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <FormControlLabel value="paystack" control={<Radio />} label="Paystack" />
                    <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                    <FormControlLabel value="pos" control={<Radio />} label="POS" />
                  </RadioGroup>
                </Stack>
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                  {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
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
