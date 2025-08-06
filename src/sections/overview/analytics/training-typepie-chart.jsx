import PropTypes from 'prop-types';

import { Box, Card, CardHeader } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 70;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function TrainingTypePieChart({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const { colors = [theme.palette.success.light], series = [], options = {} } = chart || {};

  const chartSeries = Array.isArray(series) ? series.map((i) => i.value) : [];
  const chartLabels = Array.isArray(series) ? series.map((i) => i.label) : [];

  const chartOptions = useChart({
    chart: {
      sparkline: { enabled: true },
    },
    labels: chartLabels,
    colors,
    stroke: { colors: [theme.palette.background.paper] },
    legend: {
      offsetY: 0,
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            value: {
              formatter: (value) => fNumber(value),
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      {chartSeries.length > 0 ? (
        <StyledChart
          dir="ltr"
          type="donut"
          series={chartSeries}
          options={chartOptions}
          width="100%"
          height={290}
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 5, color: theme.palette.text.secondary }}>
          No data available
        </Box>
      )}
    </Card>
  );
}

TrainingTypePieChart.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
