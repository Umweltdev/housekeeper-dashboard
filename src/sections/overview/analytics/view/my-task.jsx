import { Link } from 'react-router-dom';
import { forwardRef, useState } from 'react';

import { Box } from '@mui/system';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import RoomPriority from '../room-priority';
import AppAreaInstalled from '../app-area-installed';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import AnalyticsVerticalChart from '../analytics-vertical-chart';
import AnalyticsConversionRates from '../analytics-conversion-rates';
import AnalyticsTimeSeriesTaskCompletion from '../analytics=timeseries-task-completion';

const MyTask = forwardRef((props, ref) => {
  const theme = useTheme();
  const totalComplaints = 25; // Represents 25% completion rate
  const [range, setRange] = useState('month');

  const chartRangeData = {
    day: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [
        {
          year: '2024',
          data: [
            { name: 'Cleaned', data: [5, 6, 7, 4, 6, 5, 3] },
            { name: 'Inspected', data: [3, 5, 6, 2, 4, 5, 2] },
            { name: 'Dirty', data: [2, 1, 2, 2, 1, 2, 3] },
          ],
        },
      ],
    },
    month: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      series: [
        {
          year: '2024',
          data: [
            { name: 'Cleaned', data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49] },
            { name: 'Inspected', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77] },
            { name: 'Dirty', data: [40, 24, 33, 56, 47, 88, 99, 17, 45, 13, 96, 97] },
          ],
        },
        {
          year: '2025',
          data: [
            { name: 'Cleaned', data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49] },
            { name: 'Inspected', data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77] },
            { name: 'Dirty', data: [20, 24, 53, 56, 47, 38, 99, 17, 65, 13, 96, 77] },
          ],
        },
      ],
    },
    year: {
      categories: ['2022', '2023', '2024'],
      series: [
        {
          year: 'Total',
          data: [
            { name: 'Cleaned', data: [300, 350, 400, 420, 450, 480] },
            { name: 'Inspected', data: [280, 330, 390, 410, 440, 470] },
            { name: 'Dirty', data: [100, 90, 85, 80, 75, 70] },
          ],
        },
      ],
    },
  };

  const tasks = [
    {
      id: 1,
      assignedDate: '2025-07-25',
      completedDate: '2025-07-25',
      status: 'completed',
    },
    {
      id: 2,
      assignedDate: '2025-07-25',
      status: 'assigned',
    },
    {
      id: 3,
      assignedDate: '2025-07-26',
      completedDate: '2025-07-26',
      status: 'completed',
    },
    {
      id: 4,
      assignedDate: '2025-07-26',
      status: 'assigned',
    },
  ];

  const DUMMY_CHART_METRICS = {
    day: {
      taskCompletion: 95, // percent
      complaints: 5, // count
    },
    week: {
      taskCompletion: 72,
      complaints: 15,
    },
    month: {
      taskCompletion: 86,
      complaints: 22,
    },
  };

  const priorityData = [
    { label: 'High', value: 5 },
    { label: 'Medium', value: 3 },
    { label: 'Low', value: 7 },
  ];

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
          My Task Performance
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/dashboard/task" variant="contained">
            View Detailed Report
          </Button>
        </Box>
      </Grid>

      <Grid container spacing={3}>
        {' '}
        {/* Right side (3/5 of page): Chart + Conversion */}
        <Grid xs={12} md={6} lg={8}>
          <Box sx={{ height: '100%' }}>
            <AnalyticsTimeSeriesTaskCompletion
              title="Task Completion Over Time"
              subheader="Compare assigned and completed tasks by day"
              tasks={tasks}
            />
          </Box>
        </Grid>
        {/* Left side (2/5 of page): two stacked charts */}
        <Grid xs={12} md={6} lg={4}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Box sx={{ height: '100%' }}>
                <AnalyticsVerticalChart
                  sx={{ height: 247 }}
                  bookingData={DUMMY_CHART_METRICS} // pass full object
                  title="Percentage Task Completion"
                />
              </Box>
            </Grid>

            <Grid item>
              <Box sx={{ height: '100%' }}>
                <AnalyticsVerticalChart
                  sx={{ height: 247 }}
                  bookingData={DUMMY_CHART_METRICS}
                  title="Number of Complaints"
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
});

export default MyTask;
