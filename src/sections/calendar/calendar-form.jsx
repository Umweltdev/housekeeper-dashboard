import { mutate } from 'swr';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// MUI Components
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import {
  Chip,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetRooms } from 'src/api/room';
import { useGetBooking } from 'src/api/booking';
import { useGetRoomType } from 'src/api/roomType';

// Custom Hooks and Utils
import { useSnackbar } from 'src/components/snackbar';

// Components
import BookingConfirmationModal from './booking-confirmation-modal';

export default function BookingForm({ currentEvent, onClose, onCreateReservation }) {
  const { enqueueSnackbar } = useSnackbar();
  const { rooms } = useGetRooms();
  const { roomType } = useGetRoomType();

  const bookingId = currentEvent?.id?.split('-')[0];
  const { booking, bookingLoading } = useGetBooking(bookingId);

  // State management
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phoneNumber: '',
      fullAddress: '',
      identificationNumber: '',
    },
    rooms: [
      {
        roomType: '',
        roomNumber: '',
        floor: '',
        checkIn: new Date().getTime(),
        checkOut: new Date().getTime(),
      },
    ],
    paymentMode: '',
  });

  // Determine if we're in edit mode
  const isEditMode = Boolean(currentEvent?.id);

  // Initialize form data based on mode
  useEffect(() => {
    if (isEditMode && booking && !bookingLoading) {
      // Only update if we have booking data and we're in edit mode
      setFormData({
        customer: {
          name:
            [booking.customer?.firstName, booking.customer?.lastName].filter(Boolean).join(' ') ||
            '',
          email: booking.customer?.email || '',
          phoneNumber: booking.customer?.phoneNumber || '',
          fullAddress: booking.customer?.address || '',
          identificationNumber: booking.customer?.identificationNumber || '',
        },
        rooms: booking.rooms.map((room) => ({
          roomType: room.roomId.roomType?._id || '',
          roomNumber: String(room.roomId.roomNumber || ''),
          floor: room.roomId.floor?.name || '',
          checkIn: new Date(room.checkIn).getTime(),
          checkOut: new Date(room.checkOut).getTime(),
        })),
        paymentMode: booking.paymentMode || '',
      });

      setSelectedRooms(
        booking.rooms.map((room) => ({
          roomType: room.roomId.roomType?._id || '',
          roomNumber: String(room.roomId.roomNumber || ''),
          floor: room.roomId.floor?.name || '',
          checkIn: new Date(room.checkIn).getTime(),
          checkOut: new Date(room.checkOut).getTime(),
        }))
      );
    } else if (!isEditMode) {
      // Reset form for new booking
      setFormData({
        customer: {
          name: '',
          email: '',
          phoneNumber: '',
          fullAddress: '',
          identificationNumber: '',
        },
        rooms: [
          {
            roomType: '',
            roomNumber: '',
            floor: '',
            checkIn: new Date().getTime(),
            checkOut: new Date().getTime(),
          },
        ],
        paymentMode: '',
      });
      setSelectedRooms([]);
    }
  }, [booking, bookingLoading, isEditMode]);
  // Get unique floors
  const floors = [...new Set(rooms?.map((room) => room?.floor?.name).filter(Boolean))];

  // Filter rooms based on selected type
  useEffect(() => {
    if (selectedRoomType) {
      const filtered = rooms?.filter((room) => room.roomType === selectedRoomType);
      setFilteredRooms(filtered || []);
    } else {
      setFilteredRooms([]);
    }
  }, [selectedRoomType, rooms]);

  const handleAddRoom = () => {
    const selectedRoom = rooms.find((room) => room.roomNumber === formData.rooms[0]?.roomNumber);
    if (!selectedRoom) {
      enqueueSnackbar('Please select a valid room.', { variant: 'error' });
      return;
    }

    const newRoom = {
      roomType: selectedRoomType,
      roomNumber: selectedRoom.roomNumber,
      floor: selectedFloor,
      checkIn: formData.rooms[0]?.checkIn || new Date().getTime(),
      checkOut: formData.rooms[0]?.checkOut || new Date().getTime(),
    };

    setSelectedRooms((prev) => [...prev, newRoom]);
    setFormData((prev) => ({
      ...prev,
      rooms: [...prev.rooms, newRoom],
    }));

    setSelectedRoomType('');
    setSelectedFloor('');
    setFilteredRooms([]);
  };

  const handleRemoveRoom = (index) => {
    setSelectedRooms((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitBooking = () => {
    if (selectedRooms.length === 0) {
      enqueueSnackbar('Please add at least one room to the booking.', { variant: 'error' });
      return;
    }

    const modalData = {
      customer: formData.customer,
      rooms: selectedRooms.map((room) => ({
        ...room,
        roomId: rooms.find((r) => r.roomNumber === room.roomNumber)?._id,
        roomType: roomType.find((type) => type._id === room.roomType),
      })),
      paymentMode: formData.paymentMode,
    };

    setBookingData(modalData);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    try {
      if (isEditMode) {
        // Update existing booking
        await axiosInstance.put(`/booking/${bookingId}`, bookingData);
        enqueueSnackbar('Booking updated successfully!');
        mutate(endpoints.booking.list);
        mutate(`${endpoints.booking.details}/${bookingId}`);
      } else {
        // Create new booking
        const response = await axiosInstance.post('/api/booking', bookingData);
        if (response.data.paystackUrl) {
          window.location.href = response.data.paystackUrl;
        } else {
          enqueueSnackbar('Booking created successfully!');
          mutate(endpoints.booking.list);
        }
      }
      onClose();
      onCreateReservation(bookingData, isEditMode);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.error || 'An error occurred', { variant: 'error' });
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          overflowY: 'auto',
          height: 'calc(100vh - 64px)',
          px: 1,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
        }}
      >
        <Typography mb={2} SX={{ fontWeight: 'bold' }}>
          {isEditMode ? 'Edit Booking' : 'Create New Booking'}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Guest Name"
            value={formData.customer.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customer: { ...prev.customer, name: e.target.value },
              }))
            }
            fullWidth
          />

          <TextField
            label="Email"
            value={formData.customer.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customer: { ...prev.customer, email: e.target.value },
              }))
            }
            fullWidth
          />

          <TextField
            label="Phone Number"
            value={formData.customer.phoneNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customer: { ...prev.customer, phoneNumber: e.target.value },
              }))
            }
            fullWidth
          />

          <TextField
            label="Full Address"
            value={formData.customer.fullAddress}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customer: { ...prev.customer, fullAddress: e.target.value },
              }))
            }
            fullWidth
          />

          <TextField
            label="Identification Number"
            value={formData.customer.identificationNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customer: { ...prev.customer, identificationNumber: e.target.value },
              }))
            }
            fullWidth
          />

          <Stack spacing={2} sx={{ border: '1px solid', borderRadius: 1, p: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Room Type</InputLabel>
              <Select
                label="Room Type"
                value={selectedRoomType || ''}
                onChange={(e) => setSelectedRoomType(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select Room Type
                </MenuItem>
                {roomType?.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Floor</InputLabel>
              <Select
                label="Floor"
                value={selectedFloor || ''}
                onChange={(e) => setSelectedFloor(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select Floor
                </MenuItem>
                {floors.map((floor, index) => (
                  <MenuItem key={index} value={floor}>
                    {floor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Room Number</InputLabel>
              <Select
                label="Room Number"
                disabled={!selectedRoomType || !selectedFloor}
                value={formData.rooms[0]?.roomNumber || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rooms: [
                      {
                        ...prev.rooms[0],
                        roomNumber: e.target.value,
                      },
                    ],
                  }))
                }
              >
                <MenuItem value="" disabled>
                  Select Room Number
                </MenuItem>
                {filteredRooms
                  ?.filter((room) => room.floor?.name === selectedFloor)
                  ?.map((room) => (
                    <MenuItem key={room._id} value={room.roomNumber}>
                      {room.roomNumber}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <MobileDateTimePicker
              label="Check-in Date"
              value={formData.rooms[0]?.checkIn ? new Date(formData.rooms[0].checkIn) : null}
              onChange={(newValue) =>
                setFormData((prev) => ({
                  ...prev,
                  rooms: [
                    {
                      ...prev.rooms[0],
                      checkIn: newValue?.getTime(),
                    },
                  ],
                }))
              }
              fullWidth
            />

            <MobileDateTimePicker
              label="Check-out Date"
              value={formData.rooms[0]?.checkOut ? new Date(formData.rooms[0].checkOut) : null}
              onChange={(newValue) =>
                setFormData((prev) => ({
                  ...prev,
                  rooms: [
                    {
                      ...prev.rooms[0],
                      checkOut: newValue?.getTime(),
                    },
                  ],
                }))
              }
              fullWidth
            />

            <LoadingButton variant="contained" onClick={handleAddRoom} fullWidth sx={{ mt: 2 }}>
              Add Room to Booking
            </LoadingButton>

            {selectedRooms.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Selected Rooms:</Typography>
                {selectedRooms.map((room, index) => (
                  <Chip
                    key={index}
                    label={`Room ${room.roomNumber} - ${room.floor}`}
                    onDelete={() => handleRemoveRoom(index)}
                    sx={{ m: 0.5, width: '100%' }}
                  />
                ))}
              </Box>
            )}
          </Stack>

          <FormControl fullWidth>
            <InputLabel>Payment Mode</InputLabel>
            <Select
              label="Payment Mode"
              value={formData.paymentMode || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMode: e.target.value,
                }))
              }
            >
              <MenuItem value="" disabled>
                Select Payment Mode
              </MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="pos">POS</MenuItem>
              <MenuItem value="paystack">Paystack</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mx: 1 }}>
        <LoadingButton variant="contained" onClick={handleSubmitBooking} fullWidth>
          {isEditMode ? 'Update Booking' : 'Create Booking'}
        </LoadingButton>
        <Button variant="outlined" onClick={onClose} fullWidth sx={{ ml: 1 }}>
          Cancel
        </Button>
      </Box>

      <BookingConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookingData={bookingData}
        onConfirm={handleConfirmBooking}
        isEditMode={isEditMode}
      />
    </>
  );
}

BookingForm.propTypes = {
  currentEvent: PropTypes.shape({
    id: PropTypes.string,
    extendedProps: PropTypes.shape({
      customerName: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      roomType: PropTypes.string,
      roomPrice: PropTypes.number,
      bookingId: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  onCreateReservation: PropTypes.func,
};
