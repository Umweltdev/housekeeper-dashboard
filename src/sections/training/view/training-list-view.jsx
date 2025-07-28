import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/system';
import { useTheme, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Iconify from 'src/components/iconify';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Scrollbar from 'src/components/scrollbar';
import { useTable, getComparator } from 'src/components/table';
import { useGetBookings } from 'src/api/booking';
import { fNumber, fPercent } from 'src/utils/format-number';
import InvoiceAnalytic from '../invoice-analytic';
import { TRAINING_ITEMS } from './training-items';

const TABLE_HEAD = [
  { id: 'module', label: 'Training Module' },
  { id: 'type', label: 'Type', width: 150 },
  { id: 'description', label: 'Description', width: 300 },
  { id: 'action', label: 'Action', width: 100 },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

export default function TrainingListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { bookings, refreshBookings } = useGetBookings();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const theme = useTheme();

  useEffect(() => {
    setTableData(TRAINING_ITEMS);
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;
  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.training.details(id));
    },
    [router]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <CustomBreadcrumbs
          heading="Training & Resources"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'List' }]}
        />
      </Box>

      {/* 🔥 ENHANCED WIDGET SECTION - 10X DEV LEVEL 🔥 */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        {/* Section Header with Gradient */}

        {/* Enhanced Grid Layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Widget 1 - Tasks Mastered */}
          <Card
            sx={{
              position: 'relative',
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.success.main,
                0.1
              )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: `0 20px 40px ${alpha(theme.palette.success.main, 0.3)}`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.4)}`,
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
              },
            }}
          >
            {/* Floating Icon */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.4)}`,
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
              }}
            >
              <Iconify icon="mdi:trophy-variant" width={28} sx={{ color: 'white' }} />
            </Box>

            {/* Content */}
            <Box sx={{ pt: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1,
                  fontSize: '1.1rem',
                }}
              >
                Tasks Mastered
              </Typography>

              <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.success.main,
                    fontSize: '2.5rem',
                    lineHeight: 1,
                  }}
                >
                  8
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.9rem',
                  }}
                >
                  of 10 tasks
                </Typography>
              </Stack>

              {/* Enhanced Progress Bar */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Progress
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.success.main, fontWeight: 600 }}
                  >
                    80%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={80}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                      borderRadius: 4,
                      animation: 'progress-fill 2s ease-out',
                      '@keyframes progress-fill': {
                        '0%': { width: '0%' },
                        '100%': { width: '80%' },
                      },
                    },
                  }}
                />
              </Box>

              {/* Stats Badge */}
            </Box>
          </Card>

          {/* Widget 2 - Certifications */}
          <Card
            sx={{
              position: 'relative',
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.info.main,
                0.1
              )} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: `0 20px 40px ${alpha(theme.palette.info.main, 0.3)}`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.4)}`,
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${theme.palette.info.light} 100%)`,
              },
            }}
          >
            {/* Floating Icon */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.light} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.4)}`,
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                },
              }}
            >
              <Iconify icon="mdi:certificate" width={28} sx={{ color: 'white' }} />
            </Box>

            {/* Content */}
            <Box sx={{ pt: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1,
                  fontSize: '1.1rem',
                }}
              >
                Active Certifications
              </Typography>

              <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.info.main,
                    fontSize: '2.5rem',
                    lineHeight: 1,
                  }}
                >
                  2
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.9rem',
                  }}
                >
                  in progress
                </Typography>
              </Stack>

              {/* Enhanced Progress Bar */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Overall Progress
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.info.main, fontWeight: 600 }}
                  >
                    50%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={50}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.info.main, 0.2),
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${theme.palette.info.light} 100%)`,
                      borderRadius: 4,
                      animation: 'progress-fill 2s ease-out 0.5s both',
                      '@keyframes progress-fill': {
                        '0%': { width: '0%' },
                        '100%': { width: '50%' },
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Card>

          {/* Widget 3 - Training Hours */}
          <Card
            sx={{
              position: 'relative',
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.warning.main,
                0.1
              )} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: `0 20px 40px ${alpha(theme.palette.warning.main, 0.3)}`,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.4)}`,
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
              },
            }}
          >
            {/* Floating Icon */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${alpha(theme.palette.warning.main, 0.4)}`,
                animation: 'rotate 4s linear infinite',
                '@keyframes rotate': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <Iconify icon="mdi:timer-sand" width={28} sx={{ color: 'white' }} />
            </Box>

            {/* Content */}
            <Box sx={{ pt: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1,
                  fontSize: '1.1rem',
                }}
              >
                Training Time
              </Typography>

              <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.warning.main,
                    fontSize: '2.5rem',
                    lineHeight: 1,
                  }}
                >
                  45
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.9rem',
                  }}
                >
                  minutes this week
                </Typography>
              </Stack>

              {/* Enhanced Progress Bar */}
              <Box sx={{}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Weekly Goal
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.warning.main, fontWeight: 600 }}
                  >
                    75%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
                      borderRadius: 4,
                      animation: 'progress-fill 2s ease-out 1s both',
                      '@keyframes progress-fill': {
                        '0%': { width: '0%' },
                        '100%': { width: '75%' },
                      },
                    },
                  }}
                />
              </Box>

              {/* Stats Badge */}
            </Box>
          </Card>
        </Box>

        {/* Additional Stats Row */}
      </Box>

      {/* Table Section */}
      <Card>
        <Typography variant="h6" sx={{ p: 2 }}>
          Training & Resources
        </Typography>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.align || 'left'}
                    sortDirection={table.orderBy === headCell.id ? table.order : false}
                    sx={{ width: headCell.width }}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataInPage.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.module}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewRow(row.id)}
                    >
                      {row.action}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          page={table.page}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  let filteredData = inputData.map((el, index) => [el, index]);
  filteredData.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  filteredData = filteredData.map((el) => el[0]);

  if (name) {
    filteredData = filteredData.filter((item) =>
      item.module.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  return filteredData;
}

TrainingListView.propTypes = {
  // Add any props your component receives here
};
