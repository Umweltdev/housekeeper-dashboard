import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Container, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import TrainingTypePieChart from '../training-typepie-chart';

// import AppWidgetSummary from '../app-widget-summary';
import AnalyticsTimeSeriesTaskCompletion from '../analytics=timeseries-task-completion';

const UserTraining = forwardRef((props, ref) => {
  const theme = useTheme();
  const [range, setRange] = useState('month');
const trainingTypeBreakdown = {
  series: [
    { label: 'Onboarding', value: 30 },
    { label: 'Safety Protocols', value: 25 },
    { label: 'Cleaning Techniques', value: 35 },
    { label: 'Customer Service', value: 10 },
  ],
  colors: ['#00B8D9', '#36B37E', '#FFAB00', '#FF5630'],
};



  return (
    <Container maxWidth="xl" ref={ref}>
      <Grid
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ mt: 5 }}>
          Training & Resources
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/dashboard/training" variant="contained">
            View Training Portal
          </Button>
        </Box>
      </Grid>

      <Grid container spacing={3}>
        {/* Chart 1: Assigned vs Completed Training Modules */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <AnalyticsTimeSeriesTaskCompletion
              title="Training Modules Progress"
              subheader="Assigned vs Completed task per Month"
            />
          </Box>
        </Grid>

        {/* Chart 2: Resource Usage */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            <TrainingTypePieChart
              title="Training Type Breakdown"
              subheader="By assigned modules"
              chart={trainingTypeBreakdown}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
});

export default UserTraining;
