import { useState } from 'react';
import { addDays } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useParams } from 'react-router';
import 'react-date-range/dist/styles.css';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/theme/default.css';

import {
  Box,
  Menu,
  Modal,
  Table,
  Button,
  Select,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  TableContainer,
  InputAdornment,
  CircularProgress,
  MenuItem as DropdownMenuItem,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { useGetRooms } from 'src/api/room';
import { useRoomType } from 'src/api/roomType';

import Iconify from 'src/components/iconify';

import CheckoutPage from './CheckoutPage';

export default function TourDetailsContent() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const { rooms, refreshRooms } = useGetRooms();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomUpdates, setRoomUpdates] = useState({});
  const [loadingRoomId, setLoadingRoomId] = useState(null); // For loading spinner
  const [menuAnchor, setMenuAnchor] = useState(null); // For dropdown menu
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarRoom, setCalendarRoom] = useState(null);

  const roomTypeData = useRoomType(id);
  // console.log('roomTypeData', roomTypeData);
  // console.log("rooms", rooms);

  const filteredRooms = rooms?.filter((room) => room.roomType === id);

 const displayedRooms = filteredRooms
   ?.map((room) => {
     const now = new Date();
     const checkOutDate = room.checkOut ? new Date(room.checkOut) : null;
     const isOccupied = room.daysTillAvailable > 0 && room.checkOut;
     // Calculate availability
     const isAvailable = !isOccupied && room.isClean && !room.inMaintenance;

     // Determine status
     let status;
     let statusColor;

     if (isOccupied) {
       status = 'Occupied';
       statusColor = 'orange';
     } else if (!room.isClean || room.inMaintenance) {
       status = '⚠Not Available';
       statusColor = 'red';
     } else {
       status = 'Free';
       statusColor = 'green';
     }

     return {
       ...room,
       isAvailable,
       status,
       statusColor,
       isOccupied,
     };
   })
   .filter((room) => {
     const matchesSearch = searchQuery === '' || String(room.roomNumber).includes(searchQuery);
     const matchesFilter =
       (filter === 'available' && room.isAvailable) ||
       (filter === 'clean' && room.isClean) ||
       (filter === 'maintenance' && room.inMaintenance) ||
       filter === '';
     return matchesSearch && matchesFilter;
   });

  // console.log(roomTypeData.roomType.title);
  // console.log(selectedRoom);

  const handleOpen = (room) => {
    setSelectedRoom({
      ...room,
      checkInDate: '',
      checkOutDate: '',
      price: roomTypeData?.roomType.price,
      images: roomTypeData?.roomType.images[0],
      title: roomTypeData?.roomType.title,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRoomUpdate = async (roomId, field, value) => {
    try {
      setLoadingRoomId(roomId); // Start loading
      const updatedRoom = { ...roomUpdates[roomId], [field]: value };
      setRoomUpdates({ ...roomUpdates, [roomId]: updatedRoom });

      await axiosInstance.put(`/api/room/${roomId}`, updatedRoom);
      refreshRooms();
    } catch (err) {
      console.error('Error updating room:', err.message);
    } finally {
      setLoadingRoomId(null); // Stop loading
    }
  };

  const handleCustomerClick = async (room) => {
    if (!room.customerId) return;
    try {
      const response = await axiosInstance.get(`/api/customers/${room.customerId}`);
      setCustomerDetails(response.data);
      setCustomerModalOpen(true);
    } catch (err) {
      console.error('Error fetching customer data:', err.message);
    }
  };

  const closeCustomerModal = () => {
    setCustomerModalOpen(false);
    setCustomerDetails(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleMenuClick = (event, roomId) => {
    setMenuAnchor({ anchor: event.currentTarget, roomId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // useEffect(() => {
  //   refreshRooms();
  // });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90vw', lg: 800 },
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  console.log('CALENDER ROOMS', calendarRoom?.checkIn);

  return (
    <>
      <TableContainer>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            width: '100%',
          }}
        >
          <TextField
            id="search-room-number"
            placeholder="Search Room Number"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ width: '25%' }}>
            <InputLabel id="filter-select-label">Filter</InputLabel>
            <Select
              labelId="filter-select-label"
              id="filter-select"
              value={filter}
              onChange={handleFilterChange}
              label="Filter"
            >
              <MenuItem value="">All Rooms</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="clean">Clean</MenuItem>
              <MenuItem value="maintenance">In Maintenance</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Number</TableCell>
              <TableCell>Floor Name</TableCell>
              <TableCell>In Maintenance</TableCell>
              <TableCell>Is Clean</TableCell>
              <TableCell>Is Available</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Calender</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRooms?.map((room) => (
              <TableRow key={room._id}>
                <TableCell width={100}>{room.roomNumber}</TableCell>
                <TableCell>{room.floor?.name || 'Unknown'}</TableCell>
                <TableCell>
                  <Select
                    value={roomUpdates[room._id]?.inMaintenance ?? room.inMaintenance}
                    onChange={(e) => handleRoomUpdate(room._id, 'inMaintenance', e.target.value)}
                    disabled={room.status === 'Occupied'}
                    sx={{
                      minWidth: 120,
                      backgroundColor:
                        room.status === 'Occupied'
                          ? 'action.disabledBackground'
                          : 'background.paper',
                    }}
                  >
                    <MenuItem value>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={roomUpdates[room._id]?.isClean ?? room.isClean}
                    onChange={(e) => handleRoomUpdate(room._id, 'isClean', e.target.value)}
                    disabled={room.status === 'Occupied'}
                    sx={{
                      minWidth: 120,
                      backgroundColor:
                        room.status === 'Occupied'
                          ? 'action.disabledBackground'
                          : 'background.paper',
                    }}
                  >
                    <MenuItem value>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {loadingRoomId === room._id ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Typography
                      sx={{
                        color: room.isAvailable ? 'green' : 'red',
                        fontWeight: 'bold',
                      }}
                    >
                      {room.isAvailable ? 'Yes' : 'No'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {loadingRoomId === room._id ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Typography
                      sx={{
                        color: room.statusColor,
                        fontWeight: 'bold',
                      }}
                    >
                      {room.status}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setCalendarRoom(room);
                      setCalendarOpen(true);
                    }}
                    color="primary"
                  >
                    <Iconify icon="mdi:calendar-month-outline" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, room._id)} color="primary">
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor?.anchor}
                    open={menuAnchor?.roomId === room._id}
                    onClose={handleMenuClose}
                    sx={{ cursor: 'pointer' }}
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        handleOpen(room);
                        handleMenuClose();
                      }}
                      disabled={!room.isActuallyAvailable}
                    >
                      Reserve Room
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handleCustomerClick(room);
                        handleMenuClose();
                      }}
                      disabled={!room.customerId}
                    >
                      View Customer
                    </DropdownMenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CHECKOUT DATA */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          {selectedRoom && (
            <CheckoutPage
              roomDetails={{
                _id: selectedRoom._id,
                title: roomTypeData?.roomType?.title,
                roomNumber: selectedRoom?.roomNumber,
                price: roomTypeData?.roomType?.price,
                checkInDate: selectedRoom?.checkInDate,
                checkOutDate: selectedRoom?.checkOutDate,
                images: roomTypeData?.roomType?.images,
              }}
            />
          )}
        </Box>
      </Modal>

      {/* CALENDER MODAL */}
      <Modal open={calendarOpen} onClose={() => setCalendarOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Room {calendarRoom?.roomNumber} Availability</Typography>
          <DateRange
            locale={enUS}
            ranges={[
              {
                startDate: calendarRoom?.checkIn ? new Date(calendarRoom.checkIn) : new Date(),
                endDate: calendarRoom?.checkOut
                  ? new Date(calendarRoom.checkOut)
                  : addDays(new Date(), 1),
                key: 'selection',
              },
            ]}
            showSelectionPreview
            moveRangeOnFirstSelection={false}
            minDate={new Date()}
            disabledDates={[]}
          />
          <Button onClick={() => setCalendarOpen(false)} sx={{ mt: 2 }} variant="contained">
            Close
          </Button>
        </Box>
      </Modal>

      <Modal open={customerModalOpen} onClose={closeCustomerModal}>
        <Box sx={{ ...style }}>
          {customerDetails ? (
            <>
              <Typography variant="h6">Customer Details</Typography>
              <Typography>Name: {customerDetails.name}</Typography>
              <Typography>Email: {customerDetails.email}</Typography>
              <Typography>Phone: {customerDetails.phone}</Typography>
              <Typography>ID: {customerDetails.id}</Typography>
            </>
          ) : (
            <Typography>No customer data available.</Typography>
          )}
        </Box>
      </Modal>
    </>
  );
}

// TourDetailsContent.propTypes = {
//   rooms: PropTypes.array,
// };
