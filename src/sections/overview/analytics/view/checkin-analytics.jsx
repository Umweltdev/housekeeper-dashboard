import React from 'react';

import { Grid, Divider, Typography } from '@mui/material';

import { useGetBookings } from 'src/api/booking';

import AnalyticsAggregateChart from '../analytics-aggregate-chart';
import AnalyticsAverageTimeChart from '../analytics-average-time-chart';

const CheckInAnalytics = () => {
  const { bookings } = useGetBookings();
  console.log(bookings);

  return (
    <Grid sx={{ width: '100%' }}>
      <Divider sx={{ width: '100%', my: 2 }} />
      <Typography variant="h5" mb={2}>
        Checked In
      </Typography>
      <Grid sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <AnalyticsAggregateChart title='Current CheckIn' bookings={bookings} />
        <AnalyticsAverageTimeChart title="Avg Check-In Time by Hour" bookings={bookings} />
      </Grid>
    </Grid>
  );
};

export default CheckInAnalytics;
