import { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';

import axiosInstance from 'src/utils/axios';
import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';

import CheckoutPage from './CheckoutPage';
import makeToast from '../tour/assets/toaster';

export default function OrderDetailsItems({ items, totalAmount }) {
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);

  const handleAdditionalChargesChange = (event) => {
    setAdditionalCharges(event.target.value);
  };

  const { id } = useParams();
  

  const navigateToInvoice = () => {
    const formattedRooms = items.map((room) => ({
      roomId: room?.roomId?._id,
      roomName: room?.roomId?.roomType?.title,
      roomNumber: room?.roomId?.roomNumber,
      checkInDate: room?.checkIn,
      checkOutDate: room?.checkOut,
      roomImg: room?.roomId?.roomType?.images?.[0],
      price: room?.tPrice,
      images: room?.roomId?.roomType?.images,
    }));

    setRoomDetails({
      total: totalAmount + Number(additionalCharges),
      additionalCharges: Number(additionalCharges),
      rooms: formattedRooms,
    });

    setTimeout(() => {
      setOpenCheckoutModal(true);
    }, 100);
  };

  const handleCloseCheckoutModal = () => {
    setOpenCheckoutModal(false);
  };

  // Function to update the booking status to "checkedOut"
  const handleCheckOut = async () => {
    try {
      if (!id) {
        makeToast('error', 'No booking ID found.');
        return;
      }

      // Update the booking status to "checkedOut"
      await axiosInstance.put(`/api/booking/${id}`, {
        status: 'checkedOut',
      });

      makeToast('success', 'Booking status updated to checked-out!');
    } catch (error) {
      console.error(error);
      makeToast('error', 'Failed to update booking status.');
    }
  };

  const handleCheckout = async () => {
    // Update the booking status to "checkedOut"
    await handleCheckOut();

    if (Number(additionalCharges) > 0) {
      navigateToInvoice();
    } else {
      makeToast('success', 'Customer is checked out successfully');
    }
  };

  return (
    <Card>
      <CardHeader title="Order Details" />
      <CardContent>
        <Scrollbar>
          {items?.map((room) => (
            <Box key={room.id} sx={{ p: 3, mb: 3, borderBottom: (theme) => `dashed 2px ${theme.palette.background.neutral}` }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar src={room?.roomId?.roomType?.images?.[0] || ''} variant="rounded" sx={{ width: 64, height: 64 }} />
                <Box>
                  <ListItemText
                    primary={`${room?.roomId?.roomType?.title}, Room #${room?.roomId?.roomNumber}`}
                    secondary={`₦${room?.tPrice?.toLocaleString()}`}
                    primaryTypographyProps={{ typography: 'subtitle1' }}
                    secondaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </Box>
              </Stack>

              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Label variant="soft">Check In</Label>
                  <Box sx={{ typography: 'subtitle2' }}>{fDate(room?.checkIn)}</Box>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Label variant="soft">Expected Check Out</Label>
                  <Box sx={{ typography: 'subtitle2' }}>{fDate(room?.checkOut)}</Box>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Label variant="soft">Total</Label>
                  <Box sx={{ typography: 'subtitle2' }}>{`₦${room?.tPrice?.toLocaleString()}`}</Box>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Scrollbar>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
          <Label variant="soft">Additional Charges</Label>
          <TextField
            type="number"
            value={additionalCharges}
            onChange={handleAdditionalChargesChange}
            sx={{ width: 200 }}
          />
        </Stack>

        <Stack spacing={2} alignItems="flex-end" sx={{ my: 3, textAlign: 'right', typography: 'body2' }}>
          <Stack direction="row" sx={{ typography: 'subtitle1' }}>
            <Box>Total</Box>
            <Box sx={{ width: 160 }}>{`₦${(totalAmount + Number(additionalCharges))?.toLocaleString()}` || '-'}</Box>
          </Stack>
        </Stack>

        <Button onClick={handleCheckout} variant="contained" sx={{ mt: 3 }}>
          Check-Out
        </Button>
      </CardContent>

      {/* Checkout Modal */}
      <Dialog open={openCheckoutModal} onClose={handleCloseCheckoutModal} maxWidth="md" fullWidth>
        <CheckoutPage roomDetails={roomDetails} additionalCharges={additionalCharges} />
      </Dialog>
    </Card>
  );
}

OrderDetailsItems.propTypes = {
  items: PropTypes.array,
  totalAmount: PropTypes.number,
};