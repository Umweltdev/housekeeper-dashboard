import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Box, Card, CardHeader } from '@mui/material'; // <-- from @mui/material/styles, not @mui/system

import Chart, { useChart } from 'src/components/chart';
import { success } from 'src/theme/palette'; // use your custom success color if needed

// Static monthly dataset for Assigned vs Completed tasks
function processTaskCompletionData() {
  const labels = [
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
  ];

  const assigned = [40, 45, 50, 60, 55, 58, 62, 68, 65, 70, 75, 80];
  const completed = [38, 43, 47, 57, 52, 56, 60, 65, 63, 67, 72, 78];

  return {
    labels,
    series: [
      { name: 'Assigned', data: assigned },
      { name: 'Completed', data: completed },
    ],
  };
}

export default function AnalyticsTimeSeriesTaskCompletion({ title, subheader }) {
  const theme = useTheme(); // ✅ Use MUI's theme
  const chartData = processTaskCompletionData();

  const chartOptions = useChart({
    colors: [theme.palette.primary.main, success.main], // ✅ MUI primary color for Assigned
    chart: {
      stacked: false,
      toolbar: { show: false },
    },
    xaxis: {
      categories: chartData.labels,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        endingShape: 'rounded',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => `${value} tasks`,
      },
    },
  });

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart type="bar" series={chartData.series} options={chartOptions} height={392} />
      </Box>
    </Card>
  );
}

AnalyticsTimeSeriesTaskCompletion.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};
