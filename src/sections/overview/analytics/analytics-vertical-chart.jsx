import { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Card, Select, MenuItem, useTheme, Typography, CardContent } from '@mui/material';

import { fNumber } from 'src/utils/format-number';

export default function AnalyticsVerticalChart({ title, bookingData, ...other }) {
  const [filter, setFilter] = useState('day');
  const theme = useTheme();

  const metricKey = title === 'Percentage Task Completion' ? 'taskCompletion' : 'complaints';

  return (
    <Card {...other}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1">{title}</Typography>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              fontSize: '0.875rem',
              borderRadius: 1,
              '& .MuiSelect-icon': {
                color: 'black',
              },
            }}
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </Select>
        </Box>

        <Typography sx={{ fontSize: 50 }} fontWeight="bold">
          {fNumber(bookingData[filter]?.[metricKey] || 0)}
          {title === 'Percentage Task Completion' ? '%' : ''}
        </Typography>
      </CardContent>
    </Card>
  );
}

AnalyticsVerticalChart.propTypes = {
  title: PropTypes.string.isRequired,
  bookingData: PropTypes.object.isRequired,
};
