import PropTypes from 'prop-types';

import { Box, Card, CardHeader } from '@mui/material';

import { info, success, warning } from 'src/theme/palette';

import Chart, { useChart } from 'src/components/chart';

export default function AnalyticsSatisfactionDonutChart({ title, subheader, data }) {
  const chartOptions = useChart({
    labels: ['Satisfied', 'Neutral', 'Dissatisfied'],
    colors: [success.dark, info.dark, warning.dark],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} responses`,
      },
    },
  });

  const series = [data.satisfied, data.neutral, data.dissatisfied];

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart type="donut" series={series} options={chartOptions} width="100%" height={360} />
      </Box>
    </Card>
  );
}

AnalyticsSatisfactionDonutChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  data: PropTypes.object.isRequired,
};
