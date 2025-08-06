import PropTypes from 'prop-types';
import { Box, Card, CardHeader } from '@mui/material';
import { info, error, success } from 'src/theme/palette';

import Chart, { useChart } from 'src/components/chart';

export default function RoomPriority({ title, subheader, data }) {
  const labels = data.map((item) => item.label);
  const series = data.map((item) => item.value);

  const chartOptions = useChart({
    labels,
    colors: [error.main, info.main, success.main], // High, Medium, Low
    legend: { position: 'bottom' },
    tooltip: {
      y: {
        formatter: (value) => `${value} rooms`,
      },
    },
  });

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart type="pie" series={series} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

RoomPriority.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    })
  ).isRequired,
};