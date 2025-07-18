import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useGetRooms } from 'src/api/room';
import { useGetRoomType } from 'src/api/roomType';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function CalendarFilters({ open, onClose }) {
  const { rooms } = useGetRooms();
  const { roomType } = useGetRoomType();

  // State for filters
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoomNum, setSelectedRoomNum] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateError, setDateError] = useState(false);

  // State for filtered rooms
  const [filteredRooms, setFilteredRooms] = useState(rooms);

  // Memoized list of unique floors
  const floors = useMemo(() => {
    const uniqueFloors = new Set(rooms.map((room) => room.floor.name));
    return Array.from(uniqueFloors);
  }, [rooms]);

  // Filter rooms whenever filters change
  useEffect(() => {
    let filtered = rooms;

    // Filter by room type
    if (selectedRoomType) {
      filtered = filtered.filter((room) => room.roomType === selectedRoomType);
    }

    // Filter by floor
    if (selectedFloor) {
      filtered = filtered.filter((room) => room.floor.name === selectedFloor);
    }

    // Filter by room number
    if (selectedRoomNum) {
      filtered = filtered.filter((room) => room.roomNumber.toString().includes(selectedRoomNum));
    }

    // Filter by availability within date range
    if (startDate && endDate && !dateError) {
      filtered = filtered.filter((room) => {
        const {isAvailable} = room;
        const isWithinRange = !room.checkOut || new Date(room.checkOut) <= endDate;
        return isAvailable && isWithinRange;
      });
    }

    setFilteredRooms(filtered);
  }, [rooms, selectedRoomType, selectedFloor, selectedRoomNum, startDate, endDate, dateError]);

  // Handle room type filter change
  const handleFilterRoomType = useCallback((event) => {
    setSelectedRoomType(event.target.value);
  }, []);

  // Handle floor filter change
  const handleFilterFloor = useCallback((event) => {
    setSelectedFloor(event.target.value);
  }, []);

  // Handle room number filter change
  const handleFilterRoomNum = useCallback((event) => {
    setSelectedRoomNum(event.target.value);
  }, []);

  // Handle start date change
  const handleFilterStartDate = useCallback(
    (date) => {
      setStartDate(date);
      if (endDate && date > endDate) {
        setDateError(true);
      } else {
        setDateError(false);
      }
    },
    [endDate]
  );

  // Handle end date change
  const handleFilterEndDate = useCallback(
    (date) => {
      setEndDate(date);
      if (startDate && date < startDate) {
        setDateError(true);
      } else {
        setDateError(false);
      }
    },
    [startDate]
  );

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSelectedRoomType('');
    setSelectedFloor('');
    setSelectedRoomNum('');
    setStartDate(null);
    setEndDate(null);
    setDateError(false);
    setFilteredRooms(rooms);
  }, [rooms]);

  // Render filter inputs
  const renderFilters = (
    <Stack spacing={2} sx={{ px: 2.5, py: 2 }}>
      {/* Room Type Filter */}
      <TextField
        select
        label="Room Type"
        value={selectedRoomType}
        onChange={handleFilterRoomType}
        fullWidth
      >
        <MenuItem value="">All</MenuItem>
        {roomType.map((type) => (
          <MenuItem key={type._id} value={type._id}>
            {type.title}
          </MenuItem>
        ))}
      </TextField>

      {/* Floor Filter */}
      <TextField select label="Floor" value={selectedFloor} onChange={handleFilterFloor} fullWidth>
        <MenuItem value="">All</MenuItem>
        {floors.map((floor) => (
          <MenuItem key={floor} value={floor}>
            {floor}
          </MenuItem>
        ))}
      </TextField>

      {/* Room Number Filter */}
      <TextField
        label="Room Number"
        value={selectedRoomNum}
        onChange={handleFilterRoomNum}
        fullWidth
      />

      {/* Date Range Filter */}
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
      />
      <DatePicker
        label="End Date"
        value={endDate}
        onChange={handleFilterEndDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: dateError,
            helperText: dateError && 'End date must be later than start date',
          },
        }}
      />
    </Stack>
  );

  // Render filtered rooms
  const renderEvents = (
    <>
      <Typography variant="subtitle2" sx={{ px: 2.5, mb: 1 }}>
        Available Rooms ({filteredRooms.length})
      </Typography>

      <Scrollbar sx={{ height: 1 }}>
        {orderBy(filteredRooms, ['roomNumber'], ['asc']).map((room) => (
          <ListItemButton
            key={room.id}
            sx={{
              py: 1.5,
              borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <ListItemText
              disableTypography
              primary={
                <Typography variant="subtitle2" sx={{ fontSize: 13, mt: 0.5 }}>
                  {roomType.find((rt) => rt._id === room.roomType)?.title || 'Unknown Room Type'}
                </Typography>
              }
              secondary={
                <Box>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ fontSize: 11, color: 'text.disabled' }}
                  >
                    {`Room ${room.roomNumber} | ${room.floor.name}`}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      fontSize: 11,
                      color: room.isAvailable ? 'success.main' : 'error.main',
                      fontWeight: 'medium',
                    }}
                  >
                    {room.isAvailable ? 'Available' : 'Not Available'}
                  </Typography>
                </Box>
              }
              sx={{ display: 'flex', flexDirection: 'column-reverse' }}
            />
          </ListItemButton>
        ))}
      </Scrollbar>
    </>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2, pr: 1, pl: 2.5 }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filters
        </Typography>

        <Tooltip title="Reset">
          <IconButton onClick={handleResetFilters}>
            <Badge color="error" variant="dot">
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderFilters}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderEvents}
    </Drawer>
  );
}

CalendarFilters.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
