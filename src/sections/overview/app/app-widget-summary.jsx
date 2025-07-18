import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { fNumber, fPercent } from 'src/utils/format-number';
import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AppWidgetSummary({
  title,
  percent,
  total,
  chart,
  sx,
  icon,
  iconColor = 'primary.main',
  ...other
}) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const chartOptions = {
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '68%',
        borderRadius: 2,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
    ...options,
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 200,
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
      {...other}
    >
      {/* Icon with background */}
      {icon && (
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background:
              theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify
            icon={icon}
            width={24}
            sx={{
              color: iconColor,
            }}
          />
        </Box>
      )}

      {/* Main content */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ opacity: 0.72, mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="h3" sx={{ mb: 1 }}>
          {fNumber(total)}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Iconify
            width={20}
            icon={
              percent < 0
                ? 'solar:double-alt-arrow-down-bold-duotone'
                : 'solar:double-alt-arrow-up-bold-duotone'
            }
            sx={{
              color: percent < 0 ? 'error.main' : 'success.main',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: percent < 0 ? 'error.main' : 'success.main',
              fontWeight: 'medium',
            }}
          >
            {percent > 0 ? '+' : ''}
            {fPercent(percent)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            vs last period
          </Typography>
        </Stack>
      </Box>

      {/* Chart at bottom */}
      <Box sx={{ width: '100%', mt: 2 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={[{ data: series }]}
          options={chartOptions}
          height={36}
        />
      </Box>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  chart: PropTypes.object,
  percent: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
};
