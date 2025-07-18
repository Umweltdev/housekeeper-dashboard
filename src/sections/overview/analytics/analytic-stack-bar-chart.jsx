import PropTypes from 'prop-types';

import { useTheme } from '@mui/system';
import { Box, Card, CardHeader } from '@mui/material';

import { success, warning } from 'src/theme/palette';

import Chart, { useChart } from 'src/components/chart';



// Utility to process room data grouped by floor
function processFloorAvailabilityData(rooms) {
  const floorMap = {};

  rooms.forEach((room) => {
    const floorName = room.floor?.name || 'Unknown Floor';
    const isAvailable = room.isClean && !room.inMaintenance;

    if (!floorMap[floorName]) {
      floorMap[floorName] = { available: 0, unavailable: 0 };
    }

    if (isAvailable) {
      floorMap[floorName].available += 1;
    } else {
      floorMap[floorName].unavailable += 1;
    }
  });

  const labels = Object.keys(floorMap);
  const available = labels.map((floor) => floorMap[floor].available);
  const unavailable = labels.map((floor) => floorMap[floor].unavailable);

  return {
    labels,
    series: [
      { name: 'Available', data: available },
      { name: 'Unavailable', data: unavailable },
    ],
  };
}

export default function AnalyticsStackBarByFloor({ title, subheader, rooms }) {
  const chartData = processFloorAvailabilityData(rooms);
  const theme = useTheme();

  const chartOptions = useChart({
    colors: [success.dark, warning.main],
    chart: {
      stacked: false,
      toolbar: { show: false },
    },
    xaxis: {
      categories: chartData.labels,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        endingShape: 'rounded',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => `${value} rooms`,
      },
    },
  });

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart type="bar" series={chartData.series} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

AnalyticsStackBarByFloor.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  rooms: PropTypes.array.isRequired,
};
