import PropTypes from 'prop-types';

import { Box, Card, CardHeader } from '@mui/material';

import { info, error, success, warning } from 'src/theme/palette';

import Chart, { useChart } from 'src/components/chart';

function getRoomStatusBreakdown(rooms) {
  let ready = 0;
  let occupied = 0;
  let dirty = 0;
  let inMaintenance = 0;

  rooms.forEach((room) => {
    if (room.inMaintenance) {
      inMaintenance += 1;
    } else if (room.isClean && room.isAvailable === false) {
      occupied += 1;
    } else if (room.isClean && room.isAvailable) {
      ready += 1;
    } else {
      dirty += 1;
    }
  });

  return {
    labels: ['Ready', 'Occupied', 'Dirty', 'In Maintenance'],
    series: [ready, occupied, dirty, inMaintenance],
  };
}

export default function RoomStatusDifferentialChart({ title, subheader, rooms }) {
  const data = getRoomStatusBreakdown(rooms);

  const chartOptions = useChart({
    labels: data.labels,
    colors: [info.dark, success.dark, warning.main, error.dark],
    legend: { position: 'bottom' },
    tooltip: {
      y: {
        formatter: (value) => `${value} rooms`,
      },
    },
  });

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart type="pie" series={data.series} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

RoomStatusDifferentialChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  rooms: PropTypes.array.isRequired,
};

// RoomStatusDifferentialChart
