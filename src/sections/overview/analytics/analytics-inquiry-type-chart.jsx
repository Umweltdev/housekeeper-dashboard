import PropTypes from 'prop-types';

import { Box, Card, CardHeader } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

export default function InquiryTypeChart({ title, subheader, chart }) {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    chart: {
      type: 'bar',
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
      },
    },
    xaxis: {
      categories: labels,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} inquiries`,
      },
    },
    ...options,
  });

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart type="bar" series={series} options={chartOptions} height={320} />
      </Box>
    </Card>
  );
}

InquiryTypeChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chart: PropTypes.object.isRequired,
};
