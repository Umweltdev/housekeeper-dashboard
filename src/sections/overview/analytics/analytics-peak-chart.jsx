// file: src/sections/overview/CheckInPeakLineChart.js
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import {
  format,
  parseISO,
  startOfDay,
  startOfHour,
  startOfWeek,
  startOfYear,
  startOfMonth,
} from 'date-fns';

import { styled, useTheme } from '@mui/material/styles';
import { Card, MenuItem, TextField, CardHeader } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

const CHART_HEIGHT = 250;

const StyledChart = styled(Chart)(() => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
}));

const TIME_RANGES = ['hour', 'day', 'week', 'month', 'year'];

export default function AnalyticsPeakChart({ title, bookings }) {
  const theme = useTheme();
  const [range, setRange] = useState('day');

  const aggregated = useMemo(() => {
    const grouped = {};

    bookings.forEach((booking) => {
      booking.rooms.forEach((room) => {
        const checkIn = parseISO(room.checkIn);

        let key;
        switch (range) {
          case 'hour':
            key = format(startOfHour(checkIn), 'yyyy-MM-dd HH:00');
            break;
          case 'day':
            key = format(startOfDay(checkIn), 'yyyy-MM-dd');
            break;
          case 'week':
            key = format(startOfWeek(checkIn), 'yyyy-ww');
            break;
          case 'month':
            key = format(startOfMonth(checkIn), 'yyyy-MM');
            break;
          case 'year':
            key = format(startOfYear(checkIn), 'yyyy');
            break;
          default:
            key = format(checkIn, 'yyyy-MM-dd');
        }

        grouped[key] = (grouped[key] || 0) + 1;
      });
    });

    const sortedKeys = Object.keys(grouped).sort();

    return {
      categories: sortedKeys,
      data: sortedKeys.map((k) => grouped[k]),
    };
  }, [bookings, range]);

  const chartOptions = useChart({
    chart: { type: 'line', height: CHART_HEIGHT },
    xaxis: { categories: aggregated.categories },
    stroke: { width: 2 },
    markers: { size: 4 },
    colors: [theme.palette.info.main],
    tooltip: {
      y: {
        formatter: (val) => `${val} check-ins`,
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title={title}
        subheader="Peak check-in times by selected time range"
        action={
          <TextField select value={range} onChange={(e) => setRange(e.target.value)} size="small">
            {TIME_RANGES.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        }
        sx={{ mb: 3 }}
      />
      <StyledChart
        dir="ltr"
        type="line"
        series={[{ name: 'Check-ins', data: aggregated.data }]}
        options={chartOptions}
        width="100%"
        height={CHART_HEIGHT}
      />
    </Card>
  );
}

AnalyticsPeakChart.propTypes = {
  title: PropTypes.string,
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      rooms: PropTypes.arrayOf(
        PropTypes.shape({
          checkIn: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};
