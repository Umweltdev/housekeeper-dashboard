import PropTypes from 'prop-types';

import { Box, Card, CardHeader } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

export default function InquiryResolutionTimeChart({ title, subheader, chart }) {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    fill: {
      type: 'solid',
    },
    labels,
    xaxis: {
      categories: labels,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} mins`,
      },
    },
    ...options,
  });

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart type="bar" series={series} options={chartOptions} width="100%" height={320} />
      </Box>
    </Card>
  );
}

InquiryResolutionTimeChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chart: PropTypes.object.isRequired,
};
