import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Container, Typography, Button, Select, FormControl, InputLabel } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

import AnalyticsConversionRates from '../analytics-conversion-rates';
import AnalyticsVerticalChart from '../analytics-vertical-chart';
import AnalyticsItemRequestBreakdown from '../analytics-item-request-breakdown';
import RoomStatusDiscrepancyChart from '../analytics-room-status-descripancy-chart';

const UserInventory = forwardRef((props, ref) => {
  const theme = useTheme();
  const [range, setRange] = useState('month'); // Filter: day | week | month | year

  const requestData = {
    day: [
      { item: 'Mop', timesRequested: 4 },
      { item: 'Bucket', timesRequested: 3 },
      { item: 'Gloves', timesRequested: 5 },
      { item: 'Towel', timesRequested: 2 },
      { item: 'Toilet Brush', timesRequested: 1 },
      { item: 'Broom', timesRequested: 2 },
    ],
    week: [
      { item: 'Mop', timesRequested: 12 },
      { item: 'Bucket', timesRequested: 9 },
      { item: 'Gloves', timesRequested: 14 },
      { item: 'Towel', timesRequested: 7 },
      { item: 'Toilet Brush', timesRequested: 4 },
      { item: 'Broom', timesRequested: 6 },
    ],
    month: [
      { item: 'Mop', timesRequested: 40 },
      { item: 'Bucket', timesRequested: 32 },
      { item: 'Gloves', timesRequested: 48 },
      { item: 'Towel', timesRequested: 25 },
      { item: 'Toilet Brush', timesRequested: 15 },
      { item: 'Broom', timesRequested: 20 },
    ],
    year: [
      { item: 'Mop', timesRequested: 145 },
      { item: 'Bucket', timesRequested: 120 },
      { item: 'Gloves', timesRequested: 160 },
      { item: 'Towel', timesRequested: 100 },
      { item: 'Toilet Brush', timesRequested: 80 },
      { item: 'Broom', timesRequested: 90 },
    ],
  };

  // Static data for different time ranges
  const requestVsAcceptedByMonth = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    colors: ['#00B8D9', '#36B37E'], // Requested, Accepted
    series: [
      {
        name: 'Requested',
        data: [50, 60, 55, 70, 65, 80, 75],
      },
      {
        name: 'Accepted',
        data: [45, 55, 50, 65, 60, 72, 70],
      },
    ],
  };

  return (
    <Container maxWidth="xl" ref={ref}>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ mt: 5 }}>
          Inventory Usage
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/dashboard/inventory" variant="contained">
            View Inventory Overview
          </Button>
        </Box>
      </Grid>

      <Grid container spacing={3}>
        {/* Chart 1: MOP Quantity by Range */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <AnalyticsItemRequestBreakdown
              title="Item Request Overview"
              subheader="By frequency and quantity"
              data={requestData}
            />
          </Box>
        </Grid>

        {/* Chart 2: Requested vs Accepted */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <RoomStatusDiscrepancyChart
              title="Requested vs Accepted Inventory"
              subheader="Monthly comparison"
              chart={requestVsAcceptedByMonth}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
});

export default UserInventory;
