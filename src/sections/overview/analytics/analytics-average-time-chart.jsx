// file: src/sections/overview/AverageCheckInTimeChart.js
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { parseISO } from 'date-fns';

import { Card, CardHeader } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import Chart, { useChart } from 'src/components/chart';

const CHART_HEIGHT = 400;

const StyledChart = styled(Chart)(() => ({
  height: CHART_HEIGHT,
}));

export default function AnalyticsAverageTimeChart({ title, bookings }) {
  const theme = useTheme();

  const { hours, counts } = useMemo(() => {
    const hourCounts = new Array(24).fill(0);

    bookings.forEach((booking) => {
      booking.rooms.forEach((room) => {
        const checkInDate = parseISO(room.checkIn);
        const hour = checkInDate.getHours();
        hourCounts[hour]++;
      });
    });

    return {
      hours: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      counts: hourCounts,
    };
  }, [bookings]);

  const chartOptions = useChart({
    chart: { type: 'bar', height: CHART_HEIGHT },
    labels: hours,
    xaxis: {
      categories: hours,
      title: { text: 'Hour of Day' },
    },
    yaxis: {
      title: { text: 'Check-In Count' },
    },
    colors: [theme.palette.secondary.main],
    tooltip: {
      y: {
        formatter: (val) => `${val} check-ins`,
      },
    },
  });

  return (
    <Card>
      <CardHeader title={title} subheader="Hourly distribution of check-in times" sx={{ mb: 3 }} />
      <StyledChart
        type="bar"
        dir="ltr"
        series={[{ name: 'Check-Ins', data: counts }]}
        options={chartOptions}
        height={CHART_HEIGHT}
      />
    </Card>
  );
}

AnalyticsAverageTimeChart.propTypes = {
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
