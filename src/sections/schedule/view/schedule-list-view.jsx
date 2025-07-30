import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback, useMemo } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Container,
  Typography,
  Divider,
  Chip,
  Stack,
  Button,
  Tooltip,
  LinearProgress,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { scheduleData } from './schedule-data';

export default function ScheduleListView() {
  const settings = useSettingsContext();
  const navigate = useNavigate();
  const theme = useTheme();

  const [days, setDays] = useState(scheduleData.map((day) => ({ ...day, expanded: false })));
  const [isChronological, setIsChronological] = useState(true);

  const toggleDayExpansion = useCallback((index) => {
    setDays((prevDays) =>
      prevDays.map((day, i) => (i === index ? { ...day, expanded: !day.expanded } : day))
    );
  }, []);

  const toggleChronologicalOrder = useCallback(() => {
    setIsChronological((prev) => !prev);
    setDays((prevDays) => [...prevDays].reverse());
  }, []);

  const getStatusColor = useCallback((status) => {
    const statusColors = {
      Dirty: 'error',
      Inspected: 'info',
      Cleaned: 'success',
    };
    return statusColors[status] || 'default';
  }, []);

  const getPriorityColor = useCallback((priority) => {
    const priorityColors = {
      High: 'error',
      Medium: 'warning',
      Low: 'info',
    };
    return priorityColors[priority] || 'success';
  }, []);

  const getDayProgress = useCallback((tasks) => {
    if (!tasks?.length) return { width: '0%', label: 0 };
    const total = tasks.length;
    const score = tasks.reduce((sum, task) => {
      const statusScores = {
        Cleaned: 1,
        Inspected: 0.8,
        Dirty: 0.3,
      };
      return sum + (statusScores[task.status] || 0);
    }, 0);

    const percentage = Math.round((score / total) * 100);
    return { width: `${percentage}%`, label: percentage };
  }, []);

  const sortedDays = useMemo(() => days, [days]);

  // Get date range for display
  const dateRange = `${scheduleData[0].date.split(',')[1].trim()} - ${scheduleData[
    scheduleData.length - 1
  ].date
    .split(',')[1]
    .trim()}`;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{}}>
        <CustomBreadcrumbs
          heading="Cleaning Schedule"
          links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Schedule' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {/* <Divider /> */}
        {/* <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        > */}

        <Button
          variant={isChronological ? 'contained' : 'outlined'}
          color="primary"
          startIcon={<Iconify icon={isChronological ? 'mdi:sort-reverse' : 'mdi:sort'} />}
          onClick={toggleChronologicalOrder}
          sx={{
            ml: 2,
            backgroundColor: isChronological ? 'primary.main' : 'transparent',
            color: isChronological ? 'common.white' : 'text.primary',
            '&:hover': {
              backgroundColor: isChronological ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          {isChronological ? 'Reverse Order' : 'Chronological'}
        </Button>
      </Stack>
   

      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {sortedDays.map((day, index) => {
          const progress = getDayProgress(day.tasks);
          const isDayOff = day.tasks.length === 0 && day.workingHours === 'Day Off';

          return (
            <Box key={day.date}>
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  pb: isDayOff ? 2 : 3,
                  gap: 1.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'column',
                  cursor: isDayOff ? 'default' : 'pointer',
                  backgroundColor: day.expanded ? 'action.hover' : 'transparent',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: isDayOff ? 'transparent' : 'action.hover',
                    transition: 'background-color 0.2s ease',
                  },
                }}
                onClick={isDayOff ? undefined : () => toggleDayExpansion(index)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    flexDirection: 'row',
                  }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1" fontWeight="medium">
                        {day.date}
                      </Typography>
                      {isDayOff && (
                        <Chip label="Day Off" size="small" color="success" sx={{ ml: 1 }} />
                      )}
                    </Stack>

                    <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                      <Typography
                        variant="caption"
                        color={isDayOff ? 'success.main' : 'text.secondary'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Iconify
                          icon={isDayOff ? 'mdi:palm-tree' : 'mdi:clock-outline'}
                          width={14}
                          sx={{ mr: 0.5 }}
                        />
                        {day.workingHours}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={isDayOff ? 'success.main' : 'text.secondary'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Iconify
                          icon={isDayOff ? 'mdi:weather-sunny' : 'mdi:silverware-fork-knife'}
                          width={14}
                          sx={{ mr: 0.5 }}
                        />
                        {day.breakTime}
                      </Typography>
                    </Stack>
                  </Box>

                  {!isDayOff && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={day.tasks.length > 0 ? `${day.tasks.length} Tasks` : 'No Tasks'}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          backgroundColor: day.expanded
                            ? { xs: 'primary.light', md: 'primary.lighter' }
                            : 'transparent',
                          borderColor: day.expanded ? 'primary.light' : 'divider',
                          color: day.expanded
                            ? { xs: 'text.primary', md: 'primary.main' }
                            : 'text.secondary',
                        }}
                      />
                      <Iconify
                        icon={day.expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                        width={20}
                        sx={{ color: 'text.secondary' }}
                      />
                    </Stack>
                  )}
                </Box>

                {!isDayOff && (
                  <Box sx={{ width: '100%' }}>
                    <Tooltip title={`Progress: ${progress.label}%`}>
                      <LinearProgress
                        variant="determinate"
                        value={progress.label}
                        sx={{
                          height: 6,
                          borderRadius: 5,
                          backgroundColor: 'grey.300',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 'primary.main',
                          },
                        }}
                      />
                    </Tooltip>
                  </Box>
                )}
              </Box>

              {!isDayOff && (
                <Box
                  sx={{
                    width: '100%',
                    px: 3,
                    pb: 0,
                    pt: 0,
                    backgroundColor: day.expanded ? 'action.hover' : 'transparent',
                  }}
                >
                  {day.expanded && (
                    <Box
                      sx={{
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        pt: 0,
                        px: 0,
                        boxShadow: '0px 10px 20px rgba(0,0,0,0.05)',
                      }}
                    >
                      {day.tasks.length > 0 ? (
                        <Box sx={{ overflowX: 'auto' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              minWidth: 700,
                              px: 3,
                              py: 1,
                              backgroundColor: 'background.neutral',
                            }}
                          >
                            {['Room', 'Task', 'Category', 'Priority', 'Status', ''].map(
                              (header, i) => (
                                <Box
                                  key={i}
                                  sx={{ width: ['15%', '30%', '20%', '15%', '15%', 'auto'][i] }}
                                >
                                  <Typography variant="caption" fontWeight="bold">
                                    {header}
                                  </Typography>
                                </Box>
                              )
                            )}
                          </Box>

                          {day.tasks.map((task) => (
                            <Box
                              key={task.id}
                              sx={{
                                display: 'flex',
                                minWidth: 700,
                                px: 3,
                                py: 1.5,
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                                '&:not(:last-child)': {
                                  borderBottom: '1px solid',
                                  borderColor: 'divider',
                                },
                              }}
                            >
                              <Box sx={{ width: '15%' }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {task.room}
                                </Typography>
                              </Box>
                              <Box sx={{ width: '30%' }}>
                                <Typography
                                  variant="body2"
                                  fontWeight={task.task === 'VIP Cleaning' ? 'bold' : 'normal'}
                                >
                                  {task.task}
                                </Typography>
                              </Box>
                              <Box sx={{ width: '20%' }}>
                                <Chip
                                  label={task.category}
                                  size="small"
                                  variant="outlined"
                                  sx={{ borderRadius: 1 }}
                                />
                              </Box>
                              <Box sx={{ width: '15%' }}>
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  sx={{
                                    color:
                                      {
                                        High: theme.palette.error.main,
                                        Medium: theme.palette.warning.main,
                                        Low: theme.palette.info.main,
                                      }[task.priority] || theme.palette.success.main,
                                  }}
                                >
                                  {task.priority}
                                </Typography>
                              </Box>
                              <Box sx={{ width: '15%' }}>
                                <Chip
                                  label={task.status}
                                  size="small"
                                  color={getStatusColor(task.status)}
                                  sx={{ borderRadius: 1 }}
                                />
                              </Box>
                              <Box sx={{ pl: 0 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  startIcon={<Iconify icon="mdi:eye-outline" sx={{ mr: -0.5 }} />}
                                  sx={{
                                    borderRadius: 1,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    minWidth: 'auto',
                                    backgroundColor: 'primary.main',
                                    color: 'common.white',
                                    '&:hover': {
                                      backgroundColor: 'primary.dark',
                                    },
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/dashboard/task/${task.id}/edit`);
                                  }}
                                >
                                  View
                                </Button>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box sx={{ px: 3, py: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            No tasks assigned for this day
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              )}

              {index < sortedDays.length - 1 && <Divider />}
            </Box>
          );
        })}
      </Card>
    </Container>
  );
}
