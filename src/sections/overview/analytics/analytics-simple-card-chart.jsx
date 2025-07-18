import { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Card, Select, MenuItem, useTheme, Typography, CardContent } from '@mui/material';

export default function AnalyticsSimpleCardChart({ title }) {
  const theme = useTheme();
  const [filter, setFilter] = useState('day');

  const dummyData = {
    day: 3,
    week: 13,
    month: 43,
  };

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.warning.contrastText,
        borderRadius: 2,
        boxShadow: 3,
        height: 250,
      }}
    >
      <CardContent>
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

        <Typography sx={{ fontSize: 100 }} fontWeight="bold">
          {dummyData[filter]}
        </Typography>
      </CardContent>
    </Card>
  );
}

AnalyticsSimpleCardChart.propTypes = {
  title: PropTypes.string,
};

// export default AnalyticsSimpleCardChart;
