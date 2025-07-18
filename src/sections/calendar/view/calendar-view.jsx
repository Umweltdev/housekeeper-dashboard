import Calendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { isAfter, isBetween } from 'src/utils/format-time';

import { useGetBookings } from 'src/api/booking';
import { useGetRoomType } from 'src/api/roomType';
import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { StyledCalendar } from '../styles';
import BookingForm from '../calendar-form';
import RoomTableView from './room-list-view';
import AnalyticTable from './analytics-table';
import { useEvent, useCalendar } from '../hooks';
import CalendarToolbar from '../calendar-toolbar';
import CalendarFilters from '../calendar-filters';
import ReservationTableView from './reservation-list-table';
import CalendarFiltersResult from '../calendar-filters-result';

const defaultFilters = {
  colors: [],
  startDate: null,
  endDate: null,
};

// Color palette for room types
const ROOM_TYPE_COLORS = {
  'Standard Room': '#500103', // Coral
  'Standard Single Room': '#3F3328', // Turquoise
  'Superior Single Room': '#122126', // Yellow
  'Superior Single Room Extra': '#277826', // Mint
  'Standard Double Room': '#004057', // Blue
  'Superior Double Room': '#910202', // Purple
  'Deluxe Room': '#5B3A5C', // Pink
  'Luxury Suite': '#C25B22', // Orange
  'N/A': '#744D0A', // Gray for unknown types
};

export default function CalendarView() {
  const theme = useTheme();
  const settings = useSettingsContext();
  const smUp = useResponsive('up', 'sm');
  const openFilters = useBoolean();
  const { roomTypes } = useGetRoomType();
  const { bookings, refreshBookings } = useGetBookings();

  const [filters, setFilters] = useState(defaultFilters);
  const [reservationTable, setReservationTable] = useState([]);
  const [roomTypeColors, setRoomTypeColors] = useState(ROOM_TYPE_COLORS);

  useEffect(() => {
  setReservationTable(bookings);
}, [bookings]);


  // Update room type colors when roomTypes data changes
  useEffect(() => {
    if (roomTypes && roomTypes.length > 0) {
      const updatedColors = { ...ROOM_TYPE_COLORS };
      roomTypes.forEach((type) => {
        if (!updatedColors[type.title]) {
          // Assign a color from CALENDAR_COLOR_OPTIONS if not predefined
          const randomColor =
            CALENDAR_COLOR_OPTIONS[Math.floor(Math.random() * CALENDAR_COLOR_OPTIONS.length)];
          updatedColors[type.title] = randomColor;
        }
      });
      setRoomTypeColors(updatedColors);
    }
  }, [roomTypes]);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const mappedEvents = useMemo(() => {
    if (!bookings || !bookings.length) return [];

    return bookings.flatMap((booking) => {
      if (!booking.rooms || !booking.rooms.length) return [];

      return booking.rooms.map((room) => {
        const roomType = room.roomId?.roomType?.title || 'N/A';
        const roomColor = roomTypeColors[roomType] || ROOM_TYPE_COLORS['N/A'];
        const customerName = booking?.customer
          ? `${booking.customer.firstName || ''} ${booking.customer.lastName || ''}`.trim()
          : 'Unknown Customer';

        return {
          id: `${booking._id}-${room.roomId?._id || Date.now()}`,
          title: `${customerName} - ${room.roomId?.roomNumber || ''} - ${roomType}`,
          start: room.checkIn,
          end: room.checkOut,
          color: roomColor,
          textColor: '#ffffff',
          borderColor: theme.palette.divider,
          allDay: true,
          extendedProps: {
            customerName,
            email: booking?.customer?.email || 'N/A',
            phone: booking?.customer?.phone || 'N/A',
            roomNumber: room.roomId?.roomNumber,
            roomType,
            roomPrice: room.roomId?.price,
            bookingId: booking._id,
          },
        };
      });
    });
  }, [bookings, roomTypeColors, theme.palette.divider]);
  const handleCreateReservation = (newReservation, isUpdate) => {
    if (isUpdate) {
      setReservationTable((prev) =>
        prev.map((reservation) =>
          reservation.id === newReservation.id ? newReservation : reservation
        )
      );
      refreshBookings();
    } else {
      setReservationTable((prev) => [...prev, newReservation]);
    }
  };

  const {
    calendarRef,
    view,
    date,
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onSelectRange,
    onClickEvent,
    onResizeEvent,
    onInitialView,
    openForm,
    onOpenForm,
    onCloseForm,
    selectEventId,
    selectedRange,
  } = useCalendar();

  const currentEvent = useEvent(mappedEvents, selectEventId, selectedRange, openForm);

  useEffect(() => {
    onInitialView();
  }, [onInitialView]);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const canReset = !!filters.colors.length || (!!filters.startDate && !!filters.endDate);

  const dataFiltered = applyFilter({
    inputData: mappedEvents,
    filters,
    dateError,
  });

  const renderResults = (
    <CalendarFiltersResult
      filters={filters}
      onFilters={handleFilters}
      canReset={canReset}
      onResetFilters={handleResetFilters}
      results={dataFiltered.length}
      sx={{ mb: { xs: 3, md: 5 } }}
    />
  );

  const renderColorLegend = () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        mb: 2,
        p: 1.5,
        backgroundColor: theme.palette.background.neutral,
        borderRadius: 1,
        boxShadow: theme.customShadows.z4,
      }}
    >
      {Object.entries(roomTypeColors)
        .filter(([type]) => type !== 'N/A')
        .map(([roomType, color]) => (
          <Tooltip key={roomType} title={roomType} arrow>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1,
                py: 0.5,
                borderRadius: 0.5,
                backgroundColor: theme.palette.background.paper,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: color,
                  mr: 1,
                  borderRadius: '2px',
                }}
              />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                {roomType.length > 12 ? `${roomType.substring(0, 10)}...` : roomType}
              </Typography>
            </Box>
          </Tooltip>
        ))}
    </Box>
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        {canReset && renderResults}

        <AnalyticTable />

        <Divider sx={{ my: 3, mx: 3 }} />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            m: { xs: 0, md: 3 },
            mb: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="h4">Reservations</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpenForm}
          >
            New Reservation
          </Button>
        </Stack>

        <Card sx={{ p: 1, m: 3, display: 'flex', gap: 2 }}>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              loading={false}
              onNextDate={onDateNext}
              onPrevDate={onDatePrev}
              onToday={onDateToday}
              onChangeView={onChangeView}
              onOpenFilters={openFilters.onTrue}
            />

            <Calendar
              weekends
              editable
              droppable
              selectable
              rerenderDelay={10}
              allDayMaintainDuration
              eventResizableFromStart
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              events={mappedEvents}
              headerToolbar={false}
              select={onSelectRange}
              eventClick={onClickEvent}
              height={smUp ? 700 : 'auto'}
              eventContent={(arg) => (
                <Tooltip
                  title={
                    <div>
                      <div>
                        <strong>Guest:</strong> {arg.event.extendedProps.customerName}
                      </div>
                      <div>
                        <strong>Room:</strong> {arg.event.extendedProps.roomNumber}
                      </div>
                      <div>
                        <strong>Type:</strong> {arg.event.extendedProps.roomType}
                      </div>
                      <div>
                        <strong>Dates:</strong> {arg.event.startStr} to {arg.event.endStr}
                      </div>
                    </div>
                  }
                  arrow
                >
                  <Box
                    sx={{
                      padding: '2px 4px',
                      borderRadius: '4px',
                      backgroundColor: arg.backgroundColor,
                      color: arg.textColor,
                      border: `1px solid ${arg.borderColor}`,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {arg.event.title}
                  </Box>
                </Tooltip>
              )}
              eventDrop={(arg) => {
                onDropEvent(arg, (event) => {
                  const updatedReservations = reservationTable.map((reservation) =>
                    reservation.id === event.id
                      ? { ...reservation, startDate: event.start, endDate: event.end }
                      : reservation
                  );
                  setReservationTable(updatedReservations);
                });
              }}
              eventResize={(arg) => {
                onResizeEvent(arg, (event) => {
                  const updatedReservations = reservationTable.map((reservation) =>
                    reservation.id === event.id
                      ? { ...reservation, endDate: event.end }
                      : reservation
                  );
                  setReservationTable(updatedReservations);
                });
              }}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
            <Box sx={{ mt: 2 }}>{renderColorLegend()}</Box>
            <LoadingButton
              sx={{ my: 2, ml: 2, bgcolor: 'green', color: '#fff' }}
              variant="contained"
              onClick={openFilters.onTrue}
            >
              Room Availability
            </LoadingButton>
          </StyledCalendar>
          <Card sx={{ width: 420 }}>
            <DialogTitle sx={{ minHeight: 76 }}>
              {openForm && <> {currentEvent?.id ? 'Edit Reservation' : 'Add Reservation'}</>}
            </DialogTitle>
            <BookingForm
              currentEvent={currentEvent}
              colorOptions={CALENDAR_COLOR_OPTIONS}
              onClose={onCloseForm}
              onCreateReservation={handleCreateReservation}
            />
          </Card>
        </Card>

        <Divider sx={{ my: 3, mx: 3 }} />

        <Box sx={{ mt: 4 }}>
          <ReservationTableView reservations={reservationTable} />
        </Box>
        <Divider sx={{ my: 3, mx: 3 }} />
        <RoomTableView key={Date.now()} />
      </Container>

      <CalendarFilters open={openFilters.value} onClose={openFilters.onFalse} />
    </>
  );
}

function applyFilter({ inputData, filters, dateError }) {
  const { colors, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  inputData = stabilizedThis.map((el) => el[0]);

  if (colors.length) {
    inputData = inputData.filter((event) => colors.includes(event.color));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((event) => isBetween(event.start, startDate, endDate));
    }
  }

  return inputData;
}
