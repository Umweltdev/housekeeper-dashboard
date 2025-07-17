import { Card, CardContent, Typography, Box, Select, MenuItem, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { fCurrency, fNumber } from 'src/utils/format-number';

export default function AnalyticsVerticalChart({ title, bookingData, ...other }) {
  const [filter, setFilter] = useState('day');
  const theme = useTheme();

  const dummyData = {
    day: 4,
    week: 22,
    month: 97,
  };

  return (
    <Card
      {...other}
      // sx={{
      //   borderRadius: 2,
      //   boxShadow: 3,
      //   height: 250,
      //   width: 270,
      // }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'space-between',
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

        <Typography sx={{ fontSize: 50 }} fontWeight="bold" alignItems='bottom'>
          {fNumber(bookingData[filter])}
        </Typography>
      </CardContent>
    </Card>
  );
}

AnalyticsVerticalChart.propTypes = {
  title: PropTypes.string.isRequired,
  bookingData: PropTypes.object.isRequired, // or PropTypes.shape({ day: ..., week: ..., month: ... })
};

// export default AnalyticsVerticalChart;
