// file: src/sections/overview/CheckInChart.js
import PropTypes from 'prop-types';
import { useMemo, useState, useCallback } from 'react';
import {
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInWeeks,
  differenceInYears,
  differenceInMonths,
} from 'date-fns';

import { styled, useTheme } from '@mui/material/styles';
import { Card, MenuItem, TextField, CardHeader } from '@mui/material';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

const TIME_RANGES = ['hour', 'day', 'week', 'month', 'year'];

export default function AnalyticsAggregateChart({ title, bookings, floorsData = [] }) {
  const theme = useTheme();
  const [range, setRange] = useState('day');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [floorFilter, setFloorFilter] = useState('All');

  const roomIdToFloorName = useCallback(
    (floorId) => {
      const found = floorsData.find((f) => f._id === floorId);
      return found ? found.name : 'Unknown';
    },
    [floorsData]
  );

  const roomTypes = useMemo(
    () =>
      Array.from(
        new Set(
          bookings.flatMap((booking) =>
            booking.rooms.map((room) => room.roomId.roomType?.title || 'Unknown')
          )
        )
      ),
    [bookings]
  );

  const floors = useMemo(
    () =>
      Array.from(
        new Set(
          bookings.flatMap((booking) =>
            booking.rooms.map((room) => roomIdToFloorName(room.roomId.floor))
          )
        )
      ),
    [bookings, roomIdToFloorName]
  );

  const aggregated = useMemo(() => {
    const grouped = {};

    bookings.forEach((booking) => {
      const customerName = booking.customer?.name || 'Unknown';

      let total = 0;
      booking.rooms.forEach((room) => {
        const roomType = room.roomId.roomType?.title || 'Unknown';
        const floorName = roomIdToFloorName(room.roomId.floor);

        if (
          (roomTypeFilter === 'All' || roomTypeFilter === roomType) &&
          (floorFilter === 'All' || floorFilter === floorName)
        ) {
          const checkIn = parseISO(room.checkIn);
          const checkOut = parseISO(room.checkOut);

          switch (range) {
            case 'hour':
              total += differenceInHours(checkOut, checkIn);
              break;
            case 'day':
              total += differenceInDays(checkOut, checkIn);
              break;
            case 'week':
              total += differenceInWeeks(checkOut, checkIn);
              break;
            case 'month':
              total += differenceInMonths(checkOut, checkIn);
              break;
            case 'year':
              total += differenceInYears(checkOut, checkIn);
              break;
            default:
              total += differenceInDays(checkOut, checkIn);
          }
        }
      });

      if (total > 0) grouped[customerName] = (grouped[customerName] || 0) + total;
    });

    const sortedKeys = Object.keys(grouped).sort();

    return {
      categories: sortedKeys,
      data: sortedKeys.map((k) => grouped[k]),
    };
  }, [bookings, range, roomTypeFilter, floorFilter, roomIdToFloorName]);

  const chartOptions = useChart({
    chart: { type: 'bar', height: CHART_HEIGHT },
    xaxis: { categories: aggregated.categories },
    colors: [theme.palette.primary.main],
    dataLabels: { enabled: true },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title={title}
        subheader="Customer total stay duration (aggregated by time unit)"
        action={
          <>
            <TextField
              select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              size="small"
              sx={{ mr: 1 }}
            >
              {TIME_RANGES.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              size="small"
              sx={{ mr: 1 }}
            >
              <MenuItem value="All">All Room Types</MenuItem>
              {roomTypes.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="All">All Floors</MenuItem>
              {floors.map((floor) => (
                <MenuItem key={floor} value={floor}>
                  {floor}
                </MenuItem>
              ))}
            </TextField>
          </>
        }
        sx={{ mb: 3 }}
      />
      <StyledChart
        dir="ltr"
        type="bar"
        series={[{ name: 'Duration', data: aggregated.data }]}
        options={chartOptions}
        width="100%"
        height={CHART_HEIGHT}
      />
    </Card>
  );
}

AnalyticsAggregateChart.propTypes = {
  title: PropTypes.string,
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      customer: PropTypes.shape({
        name: PropTypes.string,
      }),
      rooms: PropTypes.arrayOf(
        PropTypes.shape({
          checkIn: PropTypes.string.isRequired,
          checkOut: PropTypes.string.isRequired,
          roomId: PropTypes.shape({
            floor: PropTypes.string,
            roomType: PropTypes.shape({
              title: PropTypes.string,
            }),
          }),
        })
      ).isRequired,
    })
  ).isRequired,
  floorsData: PropTypes.array,
};
