import React from 'react';
import PropTypes from 'prop-types';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Chip, Stack, Button, Divider, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function ScheduleModuleCard({ module, onView }) {
  const theme = useTheme();

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Advanced') return theme.palette.error.main;
    if (difficulty === 'Beginner') return theme.palette.success.main;
    return theme.palette.warning.main;
  };

  // Map module types to icons
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video':
        return 'mdi:play-circle';
      case 'Document':
        return 'mdi:file-document';
      case 'Interactive':
        return 'mdi:gamepad-variant';
      default:
        return 'mdi:book-open';
    }
  };

  // Map module types to colors
  const getTypeColor = (type) => {
    switch (type) {
      case 'Video':
        return 'error';
      case 'Document':
        return 'primary';
      case 'Interactive':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[12],
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold' }}>
          {module.module}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {module.description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2.5 }} flexWrap="wrap" gap={1}>
          <Chip
            label={module.type}
            size="small"
            icon={<Iconify icon={getTypeIcon(module.type)} width={16} />}
            sx={{
              bgcolor: alpha(theme.palette[getTypeColor(module.type)].main, 0.08),
              color: theme.palette[getTypeColor(module.type)].main,
              '& .MuiChip-icon': {
                color: theme.palette[getTypeColor(module.type)].main,
              },
            }}
          />

          {module.difficulty && (
            <Chip
              label={module.difficulty}
              size="small"
              sx={{
                bgcolor: alpha(getDifficultyColor(module.difficulty), 0.08),
                color: getDifficultyColor(module.difficulty),
              }}
            />
          )}

          {module.badge && (
            <Chip
              label={module.badge}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              }}
            />
          )}
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          size="small"
          variant="contained"
          color="primary"
          endIcon={<Iconify icon="mdi:arrow-right" />}
          onClick={onView}
          sx={{
            justifyContent: 'space-between',
            color: 'text.inherit',
            borderColor: alpha(theme.palette.grey[500], 0.24),
            '&:hover': {
              borderColor: alpha(theme.palette.grey[500], 0.48),
            },
          }}
        >
          {module.type === 'Video' && 'Watch Video'}
          {module.type === 'Document' && 'View PDF'}
          {module.type === 'Interactive' && 'Start Schedule'}
          {!module.type && (module.action || 'Start Learning')}
        </Button>
      </Box>
    </Card>
  );
}

ScheduleModuleCard.propTypes = {
  module: PropTypes.shape({
    id: PropTypes.string.isRequired,
    module: PropTypes.string.isRequired,
    type: PropTypes.string,
    url: PropTypes.string,
    description: PropTypes.string,
    duration: PropTypes.string,
    icon: PropTypes.string,
    action: PropTypes.string,
    progress: PropTypes.number,
    badge: PropTypes.string,
    difficulty: PropTypes.string,
  }).isRequired,
  onView: PropTypes.func.isRequired,
};
