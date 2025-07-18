import PropTypes from 'prop-types';

import { Box, Card, CardHeader } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

// Utility function to generate chart data
function processRoomAvailabilityData(rooms, roomTypes) {
  const typeMap = {};
  roomTypes.forEach((type) => {
    typeMap[type._id] = { title: type.title, available: 0, unavailable: 0 };
  });

  rooms.forEach((room) => {
    const typeId = room.roomType;
    const isAvailable = room.isClean && !room.inMaintenance;

    if (typeMap[typeId]) {
      if (isAvailable) {
        typeMap[typeId].available += 1;
      } else {
        typeMap[typeId].unavailable += 1;
      }
    }
  });

  const labels = Object.values(typeMap).map((t) => t.title);
  const available = Object.values(typeMap).map((t) => t.available);
  const unavailable = Object.values(typeMap).map((t) => t.unavailable);

  return {
    labels,
    series: [
      { name: 'Available', data: available },
      { name: 'Unavailable', data: unavailable },
    ],
  };
}

export default function AnalyticsStackChart({ title, subheader, rooms, roomTypes }) {
  const chartData = processRoomAvailabilityData(rooms, roomTypes);

  const chartOptions = useChart({
    colors: ['#2ecc71', '#e74c3c'],
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

AnalyticsStackChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  rooms: PropTypes.array.isRequired,
  roomTypes: PropTypes.array.isRequired,
};
