import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { Box } from '@mui/system';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { GridMoreVertIcon, GridExpandMoreIcon } from '@mui/x-data-grid';
import {
  Menu,
  Table,
  Paper,
  Modal,
  Button,
  TableRow,
  MenuItem,
  Collapse,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { formatNairaAmountLong } from 'src/utils/format-naira-short';

import { useGetUser } from 'src/api/user';
import { useGetFloors } from 'src/api/floor';
import { useGetRoomType } from 'src/api/roomType';
import {
  useExtendStay,
  useGetBookings,
  useCancelBooking,
  useCheckoutBooking,
} from 'src/api/booking';

function UserBookingTable({ id }) {
  const { user: currentUser } = useGetUser(id);
  const { bookings } = useGetBookings();
  const { roomType } = useGetRoomType();
  const { floor } = useGetFloors();
  const { cancelBooking } = useCancelBooking();
  const { checkoutBooking } = useCheckoutBooking();
  const { extendStay } = useExtendStay();

  console.log('FLOOR TYPE:', floor);

  const [loadingBookingId, setLoadingBookingId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [newCheckOutDate, setNewCheckOutDate] = useState(null);
  const [paymentMode, setPaymentMode] = useState(''); // Define paymentMode state
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRowToggle = (rowId) => {
    setExpandedRow((prev) => (prev === rowId ? null : rowId));
  };

  // Create a map of roomType by id for fast lookup
  // const roomTypeMap = roomType?.reduce((map, room) => {
  //   map[room._id] = room.title;
  //   return map;
  // }, {});

  const roomTypeMap = useMemo(
    () =>
      roomType?.reduce((map, room) => {
        map[room._id] = room.title;
        return map;
      }, {}),
    [roomType]
  );

  useEffect(() => {
    if (currentUser?.email && bookings?.length) {
      const filtered = bookings.filter((booking) => booking.customer?.email === currentUser.email);
      setFilteredBookings(filtered);
    }
  }, [currentUser, bookings]);

  // const rowsToDisplay = filteredBookings.slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage
  // );

  // Dropdown Menu Handlers
  const handleMenuOpen = (event, booking) => {
    console.log('Selected booking:', booking);
    setMenuAnchor(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Snackbar Handlers
  const handleSnackbarClose = useCallback(() => {
    setSnackbar({ open: false, message: '', severity: 'info' });
  }, []);

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

 const handleExtendStay = useCallback(() => {
   console.log('Extend Stay clicked');
   setExtendModalOpen(true);
   setNewCheckOutDate(null);
   setPaymentMode('');
   handleMenuClose();
 }, []);

  const handleExtendModalClose = () => {
    setExtendModalOpen(false);
    // setSelectedBooking(null);
  };

const submitExtendStay = async () => {
  if (!newCheckOutDate || !paymentMode) {
    setSnackbar({ open: true, message: 'Please complete all fields', severity: 'warning' });
    return;
  }

  const roomExtensions = selectedBooking.rooms.map((room) => ({
    roomId: room.roomId._id,
    newCheckOutDate: newCheckOutDate.toISOString(),
  }));

  const payload = {
    roomExtensions,
    paymentMode,
  };

  console.log('Submitting extend stay with:', payload);

  try {
    const response = await extendStay(selectedBooking._id, payload);

    console.log('Response:', response);

    if (response.paystackUrl) {
      window.location.href = response.paystackUrl; // Redirect for payment
    } else {
      setSnackbar({
        open: true,
        message: 'Booking extended successfully!',
        severity: 'success',
      });
    }
  } catch (error) {
    console.error('Error extending stay:', error);
    setSnackbar({ open: true, message: 'Error extending stay', severity: 'error' });
  }
};




  const handleCheckOut = async (bookingId) => {
    setLoadingBookingId(bookingId);

    try {
      const result = await checkoutBooking(bookingId);
      showSnackbar(result.message || 'Checkout successful', 'success');
    } catch (error) {
      showSnackbar(error.error || 'Failed to checkout booking', 'error');
    } finally {
      setLoadingBookingId(null);
      handleMenuClose();
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setLoadingBookingId(bookingId);

    try {
      const result = await cancelBooking(bookingId);
      showSnackbar(result.message || 'Booking cancelled successfully', 'success');
    } catch (error) {
      showSnackbar(error.error || 'Failed to cancel booking', 'error');
    } finally {
      setLoadingBookingId(null);
      handleMenuClose();
    }
  };

  // const getStatusCellContent = (booking, isLoading) => {
  //   if (isLoading) {
  //     return <CircularProgress size={20} />;
  //   }

  //   switch (booking?.status) {
  //     case 'cancelled':
  //       return <span style={{ color: 'red' }}>Cancelled</span>;
  //     case 'paid':
  //       return <span style={{ color: 'green' }}>Paid</span>;
  //     default:
  //       return <span style={{ color: 'orange' }}>Pending</span>;
  //   }
  // };

  const getStatusColor = (status) => {
    switch (status) {
      case 'cancelled':
        return 'error';
      case 'paid':
        return 'success';
      default:
        return 'warning';
    }
  };

  const rowsToDisplay = useMemo(
    () => filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredBookings, page, rowsPerPage]
  );

  console.log('filteredBookings', rowsToDisplay);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Rooms</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Mode</TableCell>
              <TableCell>Toal Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{}}>
            {filteredBookings.map((booking) => (
              <React.Fragment key={booking._id}>
                <TableRow>
                  <TableCell>
                    {booking?.reference || 'N/A'}
                    {/* {typeof booking?.rooms[0]?.roomId?.roomType === 'object'
                      ? booking?.rooms[0]?.roomId?.roomType?.title || 'N/A'
                      : booking?.rooms[0]?.roomId?.roomType || 'N/A'} */}
                  </TableCell>
                  <TableCell>
                    {booking?.rooms.length}
                    {/* {typeof booking?.rooms[0]?.roomId?.roomType === 'object'
                      ? booking?.rooms[0]?.roomId?.roomType?.title || 'N/A'
                      : booking?.rooms[0]?.roomId?.roomType || 'N/A'} */}
                  </TableCell>
                  <TableCell>{fDate(booking?.createdAt)}</TableCell>
                  <TableCell>
                    <Typography color={getStatusColor(booking?.status)}>
                      {booking?.status || 'Pending'}
                    </Typography>
                    ;
                  </TableCell>

                  <TableCell>{booking.paymentMode}</TableCell>
                  <TableCell>{formatNairaAmountLong(booking?.totalPrice || 0)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRowToggle(booking._id)}>
                      {expandedRow === booking._id ? (
                        <GridExpandMoreIcon />
                      ) : (
                        <GridExpandMoreIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={expandedRow === booking._id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Room Details
                        </Typography>
                        <Table size="small" sx={{ bgcolor: '#333' }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Room #</TableCell>
                              <TableCell>Name</TableCell>
                              <TableCell>Floor</TableCell>
                              {/* <TableCell>Status</TableCell> */}
                              <TableCell>CheckIn</TableCell>
                              <TableCell>CheckOut</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody size="small">
                            {booking?.rooms.map((room, index) => {
                              // Find the floor name by matching room.roomId.floor with the floor array
                              const floorName =
                                floor?.find((f) => f._id === room.roomId?.floor)?.name || 'N/A';

                              return (
                                <TableRow key={index}>
                                  <TableCell sx={{ fontSize: '12px' }}>
                                    {room.roomId?.roomNumber || 'N/A'}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '12px' }}>
                                    {typeof room?.roomId?.roomType === 'object'
                                      ? room?.roomId?.roomType?.title || 'N/A'
                                      : room?.roomId?.roomType || 'N/A'}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '12px' }}>{floorName}</TableCell>
                                  {/* <TableCell sx={{ fontSize: '12px' }}>
                                    {room.roomId?.isAvailable ? 'Available' : 'Occupied'}
                                  </TableCell> */}
                                  <TableCell sx={{ fontSize: '12px' }}>
                                    {fDate(room?.checkIn)}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: '12px' }}>
                                    {fDate(room?.checkOut)}
                                  </TableCell>
                                  <TableCell>
                                    <IconButton onClick={(e) => handleMenuOpen(e, booking)}>
                                      <GridMoreVertIcon />
                                    </IconButton>
                                    <Menu
                                      anchorEl={menuAnchor}
                                      open={Boolean(
                                        menuAnchor && selectedBooking?._id === booking._id
                                      )}
                                      onClose={handleMenuClose}
                                    >
                                      <MenuItem onClick={handleExtendStay}>Extend Stay</MenuItem>
                                      <MenuItem onClick={handleCheckOut}>Checkout</MenuItem>
                                      <MenuItem onClick={handleCancelBooking}>Cancel</MenuItem>
                                    </Menu>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No bookings found for this user.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Extend Stay Modal */}
      <Modal open={extendModalOpen} onClose={handleExtendModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Extend Stay
          </Typography>

          <DesktopDatePicker
            label="New Check Out Date"
            inputFormat="MM/dd/yyyy"
            value={newCheckOutDate}
            onChange={(newValue) => {
              if (newValue && !Number.isNaN(new Date(newValue).getTime())) {
                setNewCheckOutDate(new Date(newValue)); // Store as a valid Date object
              } else {
                setNewCheckOutDate(null); // Reset if invalid
              }
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />

          {/* Payment Mode Options */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select Payment Mode
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant={paymentMode === 'cash' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMode('cash')}
              >
                Cash
              </Button>
              <Button
                variant={paymentMode === 'POS' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMode('POS')}
              >
                POS
              </Button>
              <Button
                variant={paymentMode === 'card' ? 'contained' : 'outlined'}
                onClick={() => setPaymentMode('card')}
              >
                Card (Paystack)
              </Button>
            </Box>
          </Box>

          {/* Submit and Cancel Buttons */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={handleExtendModalClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={submitExtendStay}
              disabled={!newCheckOutDate || !paymentMode}
            >
              {loading ? 'Wait...' : 'Extend Booking'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
}

UserBookingTable.propTypes = {
  id: PropTypes.string.isRequired,
};

export default UserBookingTable;

// redeploy
