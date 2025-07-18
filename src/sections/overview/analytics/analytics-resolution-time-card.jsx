import { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Card, Select, MenuItem, Typography, CardContent } from '@mui/material';

export default function AnalyticsResolutionTimeCard({ title, resolutionData, ...other }) {
  const [range, setRange] = useState('day');

  return (
    <Card { ...other }>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1">{title}</Typography>
          <Select value={range} onChange={(e) => setRange(e.target.value)} size="small">
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </Select>
        </Box>

        <Typography variant="h3" fontWeight="bold">
          {resolutionData[range]} mins
        </Typography>
      </CardContent>
    </Card>
  );
}

AnalyticsResolutionTimeCard.propTypes = {
  title: PropTypes.string,
  resolutionData: PropTypes.object.isRequired,
};
