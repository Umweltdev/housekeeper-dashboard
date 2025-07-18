import React from 'react';

import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';

import { useGetRooms } from 'src/api/room';

import AppWidgetSummary from 'src/sections/overview/app/app-widget-summary';

const AnalyticTable = () => {
  const theme = useTheme();
  const { rooms } = useGetRooms();

  // Calculate available rooms and rooms out of order
  let availableRooms = 0;
  let roomsOutOfOrder = 0;

  // Initialize data structure for rooms available over time
  const roomsAvailableOverTime = {};

  rooms?.forEach((room) => {
    // Check if the room is available
    if (room.isAvailable) {
      availableRooms += 1;
    }

    // Check if the room is out of order
    if (room.inMaintenance || !room.isClean) {
      roomsOutOfOrder += 1;
    }

    // Group rooms by daysTillAvailabl
    const daysTillAvailable = room.daysTillAvailable || 0; // Default to 0 if undefined
    roomsAvailableOverTime[daysTillAvailable] =
      (roomsAvailableOverTime[daysTillAvailable] || 0) + 1;
  });

  // Prepare chart data for Available Rooms
  const availableRoomsChartData = {
    labels: Object.keys(roomsAvailableOverTime).map((days) => `${days} days`),
    series: Object.values(roomsAvailableOverTime),
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
      }}
    >
      {/* Available Rooms */}
      <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
        <AppWidgetSummary
          title="Available Rooms"
          percent={0.2}
          total={availableRooms || 0} // Total available rooms
          chart={{
            colors: [theme.palette.info.light, theme.palette.info.main],
            series: availableRoomsChartData.series, // Dynamic data based on daysTillAvailable
          }}
        />
      </Box>

      {/* Rooms Out of Order */}
      <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
        <AppWidgetSummary
          title="Rooms Out of Order"
          percent={0.2}
          total={roomsOutOfOrder || 0} // Total rooms out of order
          chart={{
            colors: [theme.palette.info.light, theme.palette.info.main],
            series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26], // Placeholder data
          }}
        />
      </Box>

      {/* Room Status Discrepancies */}
      <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
        <AppWidgetSummary
          title="Room Status Discrepancies"
          percent={-5.1}
          total={15 || 0} // Placeholder for discrepancies
          chart={{
            colors: [theme.palette.warning.light, theme.palette.warning.main],
            series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31], // Placeholder data
          }}
        />
      </Box>
    </Box>
  );
};

export default AnalyticTable;
