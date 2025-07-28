// src/sections/training/StatWidget.js
import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Typography, LinearProgress } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function StatWidget({ title, value, total, unit, progress, icon, color }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        position: 'relative',
        p: 3,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(
          theme.palette[color].main,
          0.05
        )} 100%)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        overflow: 'hidden',
        height: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette[color].main} 0%, ${theme.palette[color].light} 100%)`,
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].light} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 24px ${alpha(theme.palette[color].main, 0.4)}`,
        }}
      >
        <Iconify icon={icon} width={28} sx={{ color: 'white' }} />
      </Box>

      <Box sx={{ pt: 1 }}>
        <Typography variant="h6" fontWeight={700} color="text.primary" mb={1}>
          {title}
        </Typography>

        <Stack direction="row" alignItems="baseline" spacing={1} mb={2}>
          <Typography variant="h2" fontWeight={800} color={theme.palette[color].main}>
            {value}
          </Typography>
          {total && (
            <Typography variant="body2" color="text.secondary">
              of {total} tasks
            </Typography>
          )}
          {unit && (
            <Typography variant="body2" color="text.secondary">
              {unit}
            </Typography>
          )}
        </Stack>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Progress
            </Typography>
            <Typography variant="caption" color={theme.palette[color].main} fontWeight={600}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette[color].main, 0.2),
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette[color].main} 0%, ${theme.palette[color].light} 100%)`,
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </Box>
    </Card>
  );
}

StatWidget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  total: PropTypes.number,
  unit: PropTypes.string,
  progress: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error'])
    .isRequired,
};
