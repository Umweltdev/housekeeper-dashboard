import PropTypes from 'prop-types';

import { Box, Card, CardHeader } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

export default function RoomStatusDiscrepancyChart({ title, subheader, chart, ...other }) {
  const { labels, colors, series } = chart;

  const chartOptions = useChart({
    chart: { stacked: true },
    colors,
    xaxis: { categories: labels },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val} rooms`,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart type="bar" series={series} options={chartOptions} width="100%" height={325} />
      </Box>
    </Card>
  );
}

RoomStatusDiscrepancyChart.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
