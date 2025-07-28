import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function InvoiceAnalytic({ title, total, icon, color }) {
  return (
    <Card
      sx={{
        p: 3,
        width: 1,
        minWidth: {
          xs: 200, // smaller screens
          md: 180, // reduced width on medium screens
          lg: 20, // full width on large screens
        },
        borderRadius: 2.5,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette[color]?.main || color} 0%, ${
            theme.palette[color]?.dark || color
          } 100%)`,
        color: 'white',
        boxShadow: (theme) => `0 4px 16px -2px ${theme.palette[color]?.main || color}66`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: (theme) => `0 6px 20px -4px ${theme.palette[color]?.main || color}80`,
        },
        overflow: 'hidden',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at top left, rgba(255,255,255,0.12), transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            transition: 'transform 0.25s ease-in-out',
            '&:hover': {
              transform: 'rotate(5deg)',
            },
          }}
        >
          <Iconify
            icon={icon}
            width={32}
            sx={{ color: 'white', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))' }}
          />
        </Box>

        <Stack spacing={0.5}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1.1,
              color: 'inherit',
              textShadow: '0 1px 1px rgba(0,0,0,0.3)',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'inherit',
              fontFamily: "'Roboto Condensed', sans-serif",
              textShadow: '0 2px 3px rgba(0,0,0,0.4)',
            }}
          >
            {fShortenNumber(total)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

InvoiceAnalytic.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  title: PropTypes.string,
  total: PropTypes.number,
};

InvoiceAnalytic.defaultProps = {
  color: 'primary',
};
