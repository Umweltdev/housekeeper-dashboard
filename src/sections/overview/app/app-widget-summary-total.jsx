import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

export default function AppWidgetSummaryTotal({ title, percent, totals, chartData, sx, ...other }) {
  const theme = useTheme();
  const [timeframe, setTimeframe] = useState('month');
  const [totalValue, setTotalValue] = useState(totals.month || 0);
  const [seriesData, setSeriesData] = useState(chartData.month || []);

  useEffect(() => {
    // Update total value and chart data based on the selected timeframe
    setTotalValue(totals[timeframe] || 0);
    setSeriesData(chartData[timeframe] || []);
  }, [timeframe, totals, chartData]);

  const handleChange = (event) => {
    setTimeframe(event.target.value);
  };

  const chartOptions = {
    colors: [theme.palette.primary.light, theme.palette.primary.main],
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: theme.palette.primary.light, opacity: 1 },
          { offset: 100, color: theme.palette.primary.main, opacity: 1 },
        ],
      },
    },
    chart: { sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '68%', borderRadius: 2 } },
    tooltip: {
      x: { show: false },
      y: { formatter: (value) => fNumber(value), title: { formatter: () => '' } },
      marker: { show: false },
    },
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', height: 170, p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography variant="subtitle2">{title}</Typography>
          <Select value={timeframe} onChange={handleChange} size="small" sx={{ fontSize: 12 }}>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="day">Day</MenuItem>
          </Select>
        </Stack>

        <Stack
          sx={{
            mt: 2,
            mb: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Iconify
              width={24}
              icon={
                percent < 0
                  ? 'solar:double-alt-arrow-down-bold-duotone'
                  : 'solar:double-alt-arrow-up-bold-duotone'
              }
              sx={{
                mr: 1,
                color: percent < 0 ? 'error.main' : 'success.main',
              }}
            />
            <Typography variant="h3">{fNumber(totalValue)}</Typography>
          </Box>
          <Chart
            dir="ltr"
            type="bar"
            series={[{ data: seriesData }]}
            options={chartOptions}
            width={60}
            height={36}
          />
        </Stack>
      </Box>
    </Card>
  );
}

AppWidgetSummaryTotal.propTypes = {
  chartData: PropTypes.shape({
    month: PropTypes.array,
    week: PropTypes.array,
    day: PropTypes.array,
  }),
  totals: PropTypes.shape({
    month: PropTypes.number,
    week: PropTypes.number,
    day: PropTypes.number,
  }),
  percent: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string,
};
