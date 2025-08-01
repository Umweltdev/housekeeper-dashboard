import { useState } from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

export default function AnalyticsItemRequestBreakdown({ title, subheader, data }) {
  const [range, setRange] = useState('month');

  const selectedData = data[range] || [];

  const chartOptions = useChart({
    tooltip: {
      y: {
        formatter: (val) => `${val} times`,
        title: {
          formatter: () => 'Requested',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 4,
      },
    },
    xaxis: {
      categories: selectedData.map((item) => item.item),
    },
  });

  const chartSeries = [
    {
      name: 'Times Requested',
      data: selectedData.map((item) => item.timesRequested),
    },
  ];

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Range</InputLabel>
            <Select value={range} label="Range" onChange={(e) => setRange(e.target.value)}>
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
        }
      />

      <Box sx={{ mx: 3 }}>
        <Chart dir="ltr" type="bar" series={chartSeries} options={chartOptions} height={360} />
      </Box>
    </Card>
  );
}

AnalyticsItemRequestBreakdown.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  data: PropTypes.object.isRequired,
};
