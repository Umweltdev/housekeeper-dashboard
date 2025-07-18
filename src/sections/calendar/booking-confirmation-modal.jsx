import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/system';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Dialog,
  Avatar,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';
import { fDateTime } from 'src/utils/format-time';
import { formatNairaAmountLong } from 'src/utils/format-naira-short';

import { useGetBookings } from 'src/api/booking';

import Iconify from 'src/components/iconify';

import makeToast from '../tour/assets/toaster';

const ImageContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  marginTop: '10px',
});

const StyledImageGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '6px',
  alignItems: 'center',
});

const SmallImages = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const calculateTotalAmount = (checkIn, checkOut, price, additionalCharges) => {
  if (!checkIn || !checkOut || !price) return { totalAmount: 0, days: 0 };
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const baseAmount = days * price;
  const additionalAmount = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
  return { totalAmount: baseAmount + additionalAmount, days };
};

export default function BookingConfirmationModal({ open, onClose, bookingData, onConfirm }) {
  const [additionalCharges, setAdditionalCharges] = useState([]);
  const [selectedCharge, setSelectedCharge] = useState('');
  const [chargeAmount, setChargeAmount] = useState('');
  const [quantity, setQuantity] = useState(1); // New state for quantity/days
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshBookings } = useGetBookings();

  // Reset state when modal is closed
  useEffect(() => {
    if (!open) {
      setAdditionalCharges([]);
      setSelectedCharge('');
      setChargeAmount('');
      setQuantity(1); // Reset quantity to 1
    }
  }, [open]);

  if (!bookingData) return null;

  console.log('Booking Data:', bookingData); // Debugging: Log the booking data

  const { customer, rooms, paymentMode } = bookingData;

  // Calculate total amount for all rooms including additional charges
  const baseAmount = rooms.reduce((sum, room) => {
    const { totalAmount: roomTotal } = calculateTotalAmount(
      room.checkIn,
      room.checkOut,
      room.roomType?.price,
      [] // Pass an empty array to prevent double-counting additional charges
    );
    return sum + roomTotal;
  }, 0);

  const handleAddCharge = () => {
    if (selectedCharge && chargeAmount && quantity) {
      const totalChargeAmount = parseFloat(chargeAmount) * parseInt(quantity, 10);
      setAdditionalCharges((prevCharges) => [
        ...prevCharges,
        { name: selectedCharge, amount: totalChargeAmount, quantity: parseInt(quantity, 10) },
      ]);
      setSelectedCharge('');
      setChargeAmount('');
      setQuantity(1); // Reset quantity to 1
    }
  };

  const additionalAmount = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
  const totalAmount = baseAmount + additionalAmount;

  // Debugging: Log the total amount and additional charges

  const handleRemoveCharge = (index) => {
    setAdditionalCharges(additionalCharges.filter((_, i) => i !== index));
  };

  const handleConfirmBooking = async () => {
    if (!bookingData || !bookingData.rooms?.length) {
      makeToast('error', 'Booking information is incomplete, please try again.');
      return;
    }

    setLoading(true);

    const bookingPayload = {
      customer: {
        name: customer.name,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        fullAddress: customer.fullAddress,
        identificationNumber: customer.identificationNumber,
      },
      rooms: bookingData.rooms.map((room) => ({
        roomId: room.roomId,
        checkIn: room.checkIn,
        checkOut: room.checkOut,
        durationOfStay: Math.ceil(
          (new Date(room.checkOut) - new Date(room.checkIn)) / (1000 * 60 * 60 * 24)
        ),
        tPrice: room.roomType?.price,
      })),
      totalPrice: totalAmount,
      paymentMode: bookingData.paymentMode,
      additionalItems: additionalCharges.map((charge) => ({
        name: charge.name,
        amount: charge.amount,
        quantity: charge.quantity, // Include quantity in the payload
      })),
    };

    console.log('Booking Payload:', bookingPayload); // Debugging: Log the payload

    try {
      const response = await axiosInstance.post('/api/booking', bookingPayload);
      const { paystackUrl } = response.data;
      console.log('Response:', response.data);

      if (bookingData.paymentMode === 'paystack') {
        window.location.href = paystackUrl;
      } else {
        makeToast('success', 'Booking confirmed. Proceed to pay across the counter.');
        onClose();
        navigate('/dashboard/calendar');
      }
      refreshBookings();
    } catch (error) {
      makeToast('error', `Booking failed: ${error.error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>Confirm Booking</DialogTitle>
      <DialogContent>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            borderRadius: 2,
            display: 'flex',
            gap: 2,
            justifyContent: 'space-between',
            
          }}
        >
          <Grid spacing={3}>
            {/* Customer Details */}
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Customer Details
              </Typography>
              <Typography>
                <strong>Name:</strong> {customer?.name || 'N/A'}
              </Typography>
              <Typography>
                <strong>Email:</strong> {customer?.email || 'N/A'}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {customer?.phoneNumber || 'N/A'}
              </Typography>
              <Typography>
                <strong>Address:</strong> {customer?.fullAddress || 'N/A'}
              </Typography>
              <Typography>
                <strong>ID Number:</strong> {customer?.identificationNumber || 'N/A'}
              </Typography>
            </Grid>

            {/* Room Details */}
            <Typography mt={4} variant="h4" gutterBottom>
              Booking Details
            </Typography>
            <Box
              sx={{
                border: '1px solid',
                borderRadius: 1,
                p: 2,
                mt: 2,
                width: 400,
                maxHeight: 420,
                overflowY: 'auto',
                px: 1,
                '&::-webkit-scrollbar': {
                  width: '4px', // Thin scrollbar
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                  minHeight: '30px', // Minimum height of the thumb
                  maxHeight: '100px', // Maximum height of the thumb
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#555',
                },
              }}
            >
              <Grid item xs={12} mt={1}>
                {rooms?.map((room, index) => (
                  <Box key={index}>
                    <Paper sx={{ padding: 0, marginY: 1 }}>
                      <Typography>
                        <strong>Title:</strong> {room.roomType?.title || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Room Number:</strong> {room?.roomNumber || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Floor:</strong> {room?.floor || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Max People:</strong> {room.roomType?.maxPeople || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Price:</strong> {room.roomType?.price || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Check-in:</strong> {room?.checkIn ? fDateTime(room.checkIn) : 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Check-out:</strong>{' '}
                        {room?.checkOut ? fDateTime(room.checkOut) : 'N/A'}
                      </Typography>
                      <StyledImageGrid sx={{ mt: 2 }}>
                        {room.roomType?.images?.[0] && (
                          <Avatar
                            src={room.roomType.images[0]}
                            alt="Main Room Image"
                            variant="rounded"
                            sx={{ width: '100%', height: 200, borderRadius: '10px 0 0 10px' }}
                          />
                        )}
                        <SmallImages>
                          {room.roomType?.images?.slice(1, 3)?.map((image, idx) => (
                            <Avatar
                              key={idx}
                              src={image}
                              alt={`Room Image ${idx + 2}`}
                              variant="rounded"
                              sx={{ width: 100, height: 100, borderRadius: '0 10px 10px 0' }}
                            />
                          ))}
                        </SmallImages>
                      </StyledImageGrid>
                    </Paper>
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))}
              </Grid>
            </Box>
          </Grid>

          <Grid width={300}>
            {/* Payment Mode */}
            <Grid item xs={12}>
              <Typography variant="h4">Additional Charges</Typography>
              <Stack direction="column" spacing={2} alignItems="center" mt={2}>
                <TextField
                  fullWidth
                  placeholder="Charge Description"
                  value={selectedCharge}
                  onChange={(e) => setSelectedCharge(e.target.value)}
                  helperText="Type the name of the charge (e.g., Laundry, Extra Towels)"
                />
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Amount"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                />
                <TextField
                  fullWidth
                  type="number"
                  placeholder="Quantity/Days"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Button fullWidth onClick={handleAddCharge} variant="contained" sx={{ py: 1.5 }}>
                  Add
                </Button>
              </Stack>
              {additionalCharges.length > 0 && (
                <Box mt={2}>
                  {additionalCharges.map((charge, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography>
                        {charge.name}: {formatNairaAmountLong(charge.amount)} (Qty:{' '}
                        {charge.quantity})
                      </Typography>
                      <IconButton onClick={() => handleRemoveCharge(index)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid mt={4}>
              <Typography variant="h4" gutterBottom>
                Payment Details
              </Typography>
              <Typography>
                <strong>Payment Mode:</strong> {paymentMode || 'N/A'}
              </Typography>
              <Typography>
                <strong>Total Amount: {formatNairaAmountLong(totalAmount)}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={handleConfirmBooking}
          variant="contained"
          color="primary"
        >
          {loading ? 'Wait...' : 'Confirm Booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BookingConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  bookingData: PropTypes.shape({
    customer: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      phone: PropTypes.string,
      fullAddress: PropTypes.string,
      identificationNumber: PropTypes.string,
      address: PropTypes.string,
    }),
    rooms: PropTypes.arrayOf(
      PropTypes.shape({
        roomId: PropTypes.string.isRequired,
        roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        floor: PropTypes.shape({
          name: PropTypes.string,
        }),
        checkIn: PropTypes.number,
        checkOut: PropTypes.number,
      })
    ),
    paymentMode: PropTypes.string,
    roomType: PropTypes.shape({
      title: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      maxPeople: PropTypes.number,
      images: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

// redeploy
