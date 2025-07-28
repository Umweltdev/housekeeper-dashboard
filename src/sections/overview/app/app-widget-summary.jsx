import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fNumber, fPercent } from 'src/utils/format-number';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, percent, total, chart, sx, ...other }) {
  const theme = useTheme();

  // Determine color scheme based on title/content type
  const getColorScheme = () => {
    switch (title) {
      case 'High Priority':
      case 'Overdue':
        return {
          primary: theme.palette.error.main,
          secondary: theme.palette.error.light,
          icon: 'solar:danger-triangle-bold-duotone',
        };
      case 'In Progress':
        return {
          primary: theme.palette.warning.main,
          secondary: theme.palette.warning.light,
          icon: 'solar:clock-circle-bold-duotone',
        };
      case 'Completed Tasks':
        return {
          primary: theme.palette.success.main,
          secondary: theme.palette.success.light,
          icon: 'solar:check-circle-bold-duotone',
        };
      case 'Total Task':
      case 'Pending Review':
        return {
          primary: theme.palette.info.main,
          secondary: theme.palette.info.light,
          icon: 'solar:clipboard-list-bold-duotone',
        };
      case 'Blocked':
        return {
          primary: theme.palette.secondary.main,
          secondary: theme.palette.secondary.light,
          icon: 'solar:stop-circle-bold-duotone',
        };
      case 'Low Priority':
        return {
          primary: alpha(theme.palette.success.main, 0.7),
          secondary: alpha(theme.palette.success.light, 0.5),
          icon: 'solar:minus-circle-bold-duotone',
        };
      default:
        return {
          primary: theme.palette.primary.main,
          secondary: theme.palette.primary.light,
          icon:
            percent < 0
              ? 'solar:double-alt-arrow-down-bold-duotone'
              : 'solar:double-alt-arrow-up-bold-duotone',
        };
    }
  };

  const { primary, secondary, icon } = getColorScheme();
  const { colors = [secondary, primary], series, options } = chart;

  const chartOptions = {
    colors: [primary],
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: secondary, opacity: 1 },
          { offset: 100, color: primary, opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '68%',
        borderRadius: 4,
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
        alignItems: 'center',
        height: 180,
        p: 3,
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        transition: 'all 0.3s ease',
        background: `linear-gradient(135deg, ${alpha(secondary, 0.1)} 0%, ${alpha(
          theme.palette.background.paper,
          0.9
        )} 100%)`,
        borderLeft: `4px solid ${primary}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[6],
          background: `linear-gradient(135deg, ${alpha(secondary, 0.2)} 0%, ${alpha(
            theme.palette.background.paper,
            0.8
          )} 100%)`,
        },
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Iconify
            width={24}
            icon={icon}
            sx={{
              color: primary,
            }}
          />
          {percent !== undefined && percent !== null && (
            <Typography
              variant="body2"
              sx={{
                color: primary,
                fontWeight: 600,
              }}
            >
              {fPercent(Math.abs(percent))} {percent > 0 && '↑'} {percent < 0 && '↓'}
            </Typography>
          )}
        </Stack>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: primary,
            textShadow: `0 2px 4px ${alpha(primary, 0.2)}`,
          }}
        >
          {fNumber(total)}
        </Typography>
      </Box>

      <Box sx={{ width: 80, height: 60, ml: 1 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={[{ data: series }]}
          options={chartOptions}
          width="100%"
          height="100%"
        />
      </Box>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  chart: PropTypes.object,
  percent: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
};
