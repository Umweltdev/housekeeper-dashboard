import PropTypes from 'prop-types';

import { Box, Card, CardHeader } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

export default function InquiriesChart({ title, subheader, chart }) {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    stroke: { width: 2 },
    fill: { type: 'solid' },
    labels,
    xaxis: {
      type: 'category',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => `${value} inquiries`,
      },
    },
    ...options,
  });

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart type="line" series={series} options={chartOptions} width="100%" height={350} />
      </Box>
    </Card>
  );
}

InquiriesChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chart: PropTypes.object.isRequired,
};
