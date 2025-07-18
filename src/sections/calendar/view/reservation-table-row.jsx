import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import {
  Table,
  Dialog,
  TableBody,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { TableHeadCustom } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover'; // Import axios for API calls
import { useSnackbar } from 'src/components/snackbar'; // For showing notifications
import { useState } from 'react';

import { useRouter } from 'src/routes/hooks'; // Import useRouter for navigation
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'; // For date picker

export default function ReservationTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const { _id, customer = {}, orderNumber, status, paymentMode, totalPrice, rooms = [] } = row;
  const { name = 'Unknown Customer', email, phone, fullAddress } = customer;

  const confirm = useBoolean(false); // For delete confirmation
  const cancelConfirm = useBoolean(false); // For cancel confirmation
  const extendStayConfirm = useBoolean(false); // For extend stay confirmation
  const popover = usePopover();
  const showBookingDetails = useBoolean(false); // For booking details modal
  const { enqueueSnackbar } = useSnackbar(); // For showing notifications
  const [cancellationReason, setCancellationReason] = useState(''); // State for cancellation reason
  const [cancellationType, setCancellationType] = useState('guestCancelled'); // State for cancellation type
  const [newCheckOutDate, setNewCheckOutDate] = useState(null); // State for new checkout date
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('cash'); // State for payment mode
  const router = useRouter(); // Initialize useRouter

  // Function to handle cancellation
  const handleCancelReservation = async () => {
    try {
      // Validate cancellation reason
      if (!cancellationReason) {
        enqueueSnackbar('Please provide a cancellation reason.', { variant: 'error' });
        return;
      }

      // Call the backend API to cancel the reservation
      const response = await axiosInstance.put(`/api/booking/cancelBooking/${_id}`, {
        cancellationReason,
        cancellationType,
      });

      if (response.data) {
        enqueueSnackbar('Reservation cancelled successfully!', { variant: 'success' });
        // Optionally, refresh the table or update the row status
        window.location.reload(); // Reload the page to reflect changes
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.error || 'Failed to cancel reservation', {
        variant: 'error',
      });
    } finally {
      cancelConfirm.onFalse(); // Close the confirmation dialog
    }
  };

  // Function to handle extending the stay
  const handleExtendStay = async () => {
    try {
      // Validate new checkout date
      if (!newCheckOutDate) {
        enqueueSnackbar('Please select a new checkout date.', { variant: 'error' });
        return;
      }

      // Prepare room extensions data
      const roomExtensions = rooms.map((room) => ({
        roomId: room.roomId._id,
        newCheckOutDate: newCheckOutDate.toISOString(),
      }));

      // Call the backend API to extend the stay
      const response = await axiosInstance.put(`/api/booking/extendstay/${_id}`, {
        roomExtensions,
        paymentMode: selectedPaymentMode,
      });

      if (response.data) {
        enqueueSnackbar('Stay extended successfully!', { variant: 'success' });
        // Optionally, refresh the table or update the row status
        window.location.reload(); // Reload the page to reflect changes
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.error || 'Failed to extend stay', {
        variant: 'error',
      });
    } finally {
      extendStayConfirm.onFalse(); // Close the confirmation dialog
    }
  };

  // Function to handle navigation to the edit route
  const handleCheckIn = () => {
    // Navigate to the user details page with booking data
    router.push({
      pathname: `/dashboard/user/${_id}/edit`, // Use the booking ID as the route parameter
      query: {
        name,
        email,
        phone,
        address: fullAddress,
        orderNumber,
        status,
        paymentMode,
        totalPrice,
        rooms: JSON.stringify(rooms), // Pass rooms data as a JSON string
      },
    });
  };

  return (
    <>
      {/* Main Table Row */}
      <TableRow hover selected={selected}>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} sx={{ mr: 2 }}>
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {name}
              </Typography>
            }
            secondary={
              <Link
                noWrap
                variant="body2"
                onClick={onViewRow}
                sx={{ color: 'text.disabled', cursor: 'pointer' }}
              >
                {`${customer.email}`}
              </Link>
            }
          />
        </TableCell>

        <TableCell>{orderNumber}</TableCell>
        <TableCell>{`₦${totalPrice?.toLocaleString()}`}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{paymentMode}</TableCell>
        <TableCell>{rooms.length} Room(s)</TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Popover for Actions */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 'fit-content', p: 1 }}
      >
        <MenuItem
          onClick={() => {
            handleCheckIn(); // Navigate to the edit route
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Check In
        </MenuItem>

        <MenuItem
          onClick={() => {
            showBookingDetails.onTrue(); // Open booking details modal
            popover.onClose();
          }}
        >
          <Iconify icon="solar:document-text-bold" />
          Booking Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            extendStayConfirm.onTrue(); // Open extend stay modal
            popover.onClose();
          }}
          disabled={status === 'cancelled'} // Disable if already cancelled
        >
          <Iconify icon="solar:calendar-add-bold" />
          Extend Stay
        </MenuItem>

        <MenuItem
          onClick={() => {
            cancelConfirm.onTrue(); // Open cancel confirmation dialog
            popover.onClose();
          }}
          disabled={status === 'cancelled'} // Disable if already cancelled
        >
          <Iconify icon="solar:close-circle-bold" />
          Cancel Reservation
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      {/* Booking Details Modal */}
      <Dialog
        open={showBookingDetails.value}
        onClose={showBookingDetails.onFalse}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Customer: {name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Order Number: {orderNumber}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Status: {status}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Payment Mode: {paymentMode}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Total Price: ₦{totalPrice?.toLocaleString()}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Rooms Booked:
          </Typography>
          <Table>
            <TableHeadCustom
              headLabel={[
                { id: 'roomNumber', label: 'Room Number' },
                { id: 'roomType', label: 'Room Type' },
                { id: 'checkIn', label: 'Check-In Date' },
                { id: 'checkOut', label: 'Check-Out Date' },
                { id: 'price', label: 'Price' },
              ]}
            />
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room._id}>
                  <TableCell>{room.roomId?.roomNumber || 'N/A'}</TableCell>
                  <TableCell>{room.roomId?.roomType?.title || 'N/A'}</TableCell>
                  <TableCell>{new Date(room.checkIn).toLocaleString()}</TableCell>
                  <TableCell>{new Date(room.checkOut).toLocaleString()}</TableCell>
                  <TableCell>{`₦${room.tPrice?.toLocaleString()}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={showBookingDetails.onFalse} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete this reservation?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />

      {/* Cancel Reservation Confirmation Dialog */}
      <ConfirmDialog
        open={cancelConfirm.value}
        onClose={cancelConfirm.onFalse}
        title="Cancel Reservation"
        content={
          <>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to cancel this reservation?
            </Typography>
            <TextField
              fullWidth
              label="Cancellation Reason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              sx={{ mt: 2 }}
              required
            />
            <TextField
              fullWidth
              select
              label="Cancellation Type"
              value={cancellationType}
              onChange={(e) => setCancellationType(e.target.value)}
              sx={{ mt: 2 }}
            >
              <MenuItem value="guestCancelled">Guest Cancelled</MenuItem>
              <MenuItem value="hotelCancelled">Hotel Cancelled</MenuItem>
            </TextField>
          </>
        }
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={handleCancelReservation}
            disabled={!cancellationReason} // Disable if no reason is provided
          >
            Cancel Reservation
          </Button>
        }
      />

      {/* Extend Stay Modal */}
      <Dialog
        open={extendStayConfirm.value}
        onClose={extendStayConfirm.onFalse}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Extend Stay</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Select a new checkout date and payment mode to extend the stay.
          </Typography>
          <MobileDateTimePicker
            label="New Check-Out Date"
            value={newCheckOutDate}
            onChange={(newValue) => setNewCheckOutDate(newValue)}
            sx={{ mt: 2, width: '100%' }}
          />
          <TextField
            fullWidth
            select
            label="Payment Mode"
            value={selectedPaymentMode}
            onChange={(e) => setSelectedPaymentMode(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="paystack">Paystack</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={extendStayConfirm.onFalse} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExtendStay}
            disabled={!newCheckOutDate} // Disable if no date is selected
          >
            Extend Stay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ReservationTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    customer: PropTypes.shape({
      name: PropTypes.string,
    }),
    orderNumber: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    paymentMode: PropTypes.string.isRequired,
    totalPrice: PropTypes.number.isRequired,
    rooms: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        roomId: PropTypes.shape({
          roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          roomType: PropTypes.shape({
            title: PropTypes.string,
          }),
        }),
        checkIn: PropTypes.string.isRequired,
        checkOut: PropTypes.string.isRequired,
        tPrice: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  selected: PropTypes.bool,
};
