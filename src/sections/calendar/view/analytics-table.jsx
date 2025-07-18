import React from 'react';

import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';

import { useGetBookings } from 'src/api/booking';

import AppWidgetSummary from 'src/sections/overview/app/app-widget-summary';
import AppWidgetSummaryTotal from 'src/sections/overview/app/app-widget-summary-total';
import AppWidgetSummaryReservation from 'src/sections/overview/app/app-widget-summary-reservation';

const AnalyticTable = () => {
  const theme = useTheme();
  const { bookings } = useGetBookings();

  // Helper function to calculate the difference in days between two dates
  const calculateDaysDifference = (date1, date2) => {
    const timeDifference = new Date(date1) - new Date(date2);
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  // Helper function to get the week number of a date
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Set to nearest Thursday
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  // Initialize data structures for guest counts
  const monthlyGuests = {};
  const weeklyGuests = {};
  const dailyGuests = {};

  // Initialize data structures for length of stay and lead time
  let totalGuests = 0;
  let totalLengthOfStay = 0;
  let totalLeadTime = 0;
  const leadTimeData = [];
  const lengthOfStayData = [];

  // Process bookings data
  bookings.forEach((booking) => {
    booking.rooms.forEach((room) => {
      // Calculate guests (assuming 1 guest per room for simplicity)
      totalGuests += 1;

      // Calculate length of stay
      const lengthOfStay = calculateDaysDifference(room.checkOut, room.checkIn);
      totalLengthOfStay += lengthOfStay;
      lengthOfStayData.push(lengthOfStay);

      // Calculate lead time (difference between booking creation and check-in)
      const leadTime = calculateDaysDifference(room.checkIn, booking.createdAt);
      totalLeadTime += leadTime;
      leadTimeData.push(leadTime);

      // Group guests by month, week, and day
      const checkInDate = new Date(room.checkIn);
      const monthKey = `${checkInDate.getFullYear()}-${checkInDate.getMonth() + 1}`;
      const weekKey = `${checkInDate.getFullYear()}-W${getWeekNumber(checkInDate)}`;
      const dayKey = `${checkInDate.getFullYear()}-${
        checkInDate.getMonth() + 1
      }-${checkInDate.getDate()}`;

      // Increment guest counts
      monthlyGuests[monthKey] = (monthlyGuests[monthKey] || 0) + 1;
      weeklyGuests[weekKey] = (weeklyGuests[weekKey] || 0) + 1;
      dailyGuests[dayKey] = (dailyGuests[dayKey] || 0) + 1;
    });
  });

  // Calculate averages
  const averageLengthOfStay = (totalLengthOfStay / bookings.length).toFixed(1);
  const averageLeadTime = (totalLeadTime / bookings.length).toFixed(1);

  // Prepare chart data for Guests
  const guestChartData = {
    month: Object.values(monthlyGuests),
    week: Object.values(weeklyGuests),
    day: Object.values(dailyGuests),
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        mx: 3,
      }}
    >
      {/* Guests Chart */}
      <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
        <AppWidgetSummaryTotal
          title="Guests"
          percent={2.6}
          totals={{
            month: guestChartData.month.reduce((a, b) => a + b, 0), // Total guests for the month
            week: guestChartData.week.reduce((a, b) => a + b, 0), // Total guests for the week
            day: guestChartData.day.reduce((a, b) => a + b, 0), // Total guests for the day
          }}
          chartData={guestChartData}
        />
      </Box>

      {/* Average Length of Stay Chart */}
      <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
        <AppWidgetSummary
          title="Average Length of Stay"
          percent={0.2}
          total={averageLengthOfStay || 0}
          chart={{
            colors: [theme.palette.info.light, theme.palette.info.main],
            series: lengthOfStayData.slice(0, 10), // Use actual data
          }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
        <AppWidgetSummary
          title="Cancellations/No-shows"
          percent={-5.1}
          total={15 || 0}
          chart={{
            colors: [theme.palette.warning.light, theme.palette.warning.main],
            series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
          }}
        />
      </Box>

      {/* Booking Lead Time Chart */}
      <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
        <AppWidgetSummary
          title="Booking Lead Time"
          percent={0.2}
          total={averageLeadTime || 0}
          chart={{
            colors: [theme.palette.info.light, theme.palette.info.main],
            series: leadTimeData.slice(0, 10), // Use actual data
          }}
        />
      </Box>

      {/* Reservation Channel Chart */}
      <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
        <AppWidgetSummaryReservation
          title="Reservation Channel"
          percent={2.6}
          totals={{
            online: { month: 150, week: 40, day: 5 },
            incall: { month: 100, week: 30, day: 3 },
            'walk-in': { month: 50, week: 10, day: 2 },
          }}
          chartData={{
            online: {
              month: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              week: [3, 10, 8, 40, 50, 7, 22],
              day: [1, 5, 3, 15, 20, 2, 10],
            },
            incall: {
              month: [3, 10, 8, 40, 50, 7, 22],
              week: [2, 5, 6, 20, 30, 4, 15],
              day: [1, 2, 3, 10, 15, 1, 8],
            },
            'walk-in': {
              month: [1, 5, 3, 15, 20, 2, 10],
              week: [1, 3, 2, 10, 15, 1, 8],
              day: [0, 1, 1, 5, 10, 0, 5],
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AnalyticTable;
