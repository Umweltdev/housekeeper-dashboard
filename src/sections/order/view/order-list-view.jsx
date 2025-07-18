/* eslint-disable perfectionist/sort-imports */
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Divider } from '@mui/material';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import axiosInstance from 'src/utils/axios';
// import { useGetinvoices } from 'src/api/booking';
import { useGetInvoices } from 'src/api/invoice';

import { useGetBookings } from 'src/api/booking';

import AppWidgetSummaryTotal from 'src/sections/overview/app/app-widget-summary-total';

import OrderTableRow from '../order-table-row';
import OrderTableToolbar from '../order-table-toolbar';
import OrderTableFiltersResult from '../order-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customerName', label: 'Customer Name' },
  { id: 'check-in', label: 'Check-In', width: 150 },
  { id: 'totalPrice', label: 'Amount Paid', width: 200 },
  { id: 'status', label: 'Status', width: 200 },
  { id: 'roomType', label: 'Room Type', width: 150 },
  { id: 'roomNumber', label: 'Room Number', width: 150 },
  { id: '', width: 100 },
];

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function OrderListView({ showCrumb }) {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const theme = useTheme();

  const { invoices, refreshInvoices } = useGetInvoices();

  const { bookings, refreshBookings } = useGetBookings();

  // console.log(invoices);

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);
  const [selectedMonth, setSelectedMonth] = useState('all');

  const dateError = isAfter(filters.startDate, filters.endDate);

  useEffect(() => {
    setTableData(bookings);
  }, [bookings]);


  const dataFiltered = applyFilter({
    inputData: bookings,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

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

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await axiosInstance.delete(`/api/booking/${id}`);
        enqueueSnackbar('Deleted Successfully!', { variant: 'success' });
  
        // Update the state to reflect the deletion
        setTableData((prevData) => prevData.filter((row) => row._id !== id));
  
        // Optionally refresh users from the server
        refreshBookings();
      } catch (error) {
        enqueueSnackbar('Deleted Successfully!', { variant: 'success' });
        console.error(error);
      }
    },
    [refreshBookings, enqueueSnackbar]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const calculateDaysDifference = (date1, date2) => {
    const timeDifference = new Date(date1) - new Date(date2);
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  // Helper function to get the week number of a date
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Set to nearest Thursday
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  // Initialize data structures for guest counts
  const monthlyGuests = {};
  const weeklyGuests = {};
  const dailyGuests = {};

  // Initialize data structures for length of stay and lead time
  let totalGuests = 0;
  let totalLengthOfStay = 0;
  let totalLeadTime = 0;
  const leadTimeData = [];
  const lengthOfStayData = [];

  // Process bookings data
  bookings.forEach((booking) => {
    booking.rooms.forEach((room) => {
      // Calculate guests (assuming 1 guest per room for simplicity)
      totalGuests += 1;

      // Calculate length of stay
      const lengthOfStay = calculateDaysDifference(room.checkOut, room.checkIn);
      totalLengthOfStay += lengthOfStay;
      lengthOfStayData.push(lengthOfStay);

      // Calculate lead time (difference between booking creation and check-in)
      const leadTime = calculateDaysDifference(room.checkIn, booking.createdAt);
      totalLeadTime += leadTime;
      leadTimeData.push(leadTime);

      // Group guests by month, week, and day
      const checkInDate = new Date(room.checkIn);
      const monthKey = `${checkInDate.getFullYear()}-${checkInDate.getMonth() + 1}`;
      const weekKey = `${checkInDate.getFullYear()}-W${getWeekNumber(checkInDate)}`;
      const dayKey = `${checkInDate.getFullYear()}-${
        checkInDate.getMonth() + 1
      }-${checkInDate.getDate()}`;

      // Increment guest counts
      monthlyGuests[monthKey] = (monthlyGuests[monthKey] || 0) + 1;
      weeklyGuests[weekKey] = (weeklyGuests[weekKey] || 0) + 1;
      dailyGuests[dayKey] = (dailyGuests[dayKey] || 0) + 1;
    });
  });

  // Extract check-in dates from bookings
  const checkOutDates = bookings
  .filter((booking) => booking.status === 'checkedOut') // Filter by status
  .flatMap((booking) => booking.rooms.map((room) => new Date(room.checkIn)));

// Calculate the average check-ins per day
let averageCheckOutsPerDay = 0;

let averageCheckOutsPerHour = 0;

if (checkOutDates.length > 0) {
const minDate = new Date(Math.min(...checkOutDates));
const maxDate = new Date(Math.max(...checkOutDates));

const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24) || 1;
averageCheckOutsPerDay = (checkOutDates.length / totalDays).toFixed(2);

averageCheckOutsPerHour = averageCheckOutsPerDay/24
}

  // Prepare chart data for Guests
  const guestChartData = {
    month: Object.values(monthlyGuests),
    week: Object.values(weeklyGuests),
    day: Object.values(dailyGuests),
  };

  return (
    <>
      <Container sx={{ paddingX: '0 !important' }} maxWidth={settings.themeStretch ? false : 'lg'}>
        <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 3,
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    flexWrap: 'wrap',
                    mx: 3,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
                    <AppWidgetSummaryTotal
                      title="Guests"
                      percent={2.6}
                      totals={{ 
                        month: guestChartData.month.reduce((a, b) => a + b, 0), 
                        week: guestChartData.week.reduce((a, b) => a + b, 0)/4, // Total guests for the week
                        day: guestChartData.day.reduce((a, b) => a + b, 0)/28, // Total guests for the day
                      }}
                      chartData={guestChartData}
                    />
                  </Box>
        
                  <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
  <AppWidgetSummaryTotal
    title="Average Check-outs"
    percent={0.2}
    totals={{ 
      month: averageCheckOutsPerDay * 30,
      week: averageCheckOutsPerDay * 7, 
      day: averageCheckOutsPerDay
    }}
    chartData={{
      month: [/* Your monthly check-out data series */],
      week: [/* Your weekly check-out data series */], 
      day: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26] // Your existing daily series
    }}
    onTimeframeChange={setSelectedMonth} // Connects to your month selector
    selectedTimeframe={selectedMonth}
    chartColors={[theme.palette.info.light, theme.palette.info.main]}
  />
</Box>
        
                  {/* <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
                    <AppWidgetSummary
                      title="Check-outs per hour"
                      percent={-5.1}
                      total={averageCheckOutsPerHour}
                      chart={{
                        colors: [theme.palette.warning.light, theme.palette.warning.main],
                        series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
                      }}
                    />
                  </Box> */}
                  {/* <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
                    <AppWidgetSummary
                      title="Peak Period"
                      percent={0.2}
                      total={'6' || 0}
                      chart={{
                        colors: [theme.palette.info.light, theme.palette.info.main],
                        series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
                      }}
                    />
                  </Box>
        
                  <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
                    <AppWidgetSummaryReservation
                      title="Check-outs Channel"
                      percent={2.6}
                      totals={{
                        online: { month: 150, week: 40, day: 5 },
                        incall: { month: 100, week: 30, day: 3 },
                        'walk-in': { month: 50, week: 10, day: 2 },
                      }}
                      chartData={{
                        online: {
                          month: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                          week: [3, 10, 8, 40, 50, 7, 22],
                          day: [1, 5, 3, 15, 20, 2, 10],
                        },
                        incall: {
                          month: [3, 10, 8, 40, 50, 7, 22],
                          week: [2, 5, 6, 20, 30, 4, 15],
                          day: [1, 2, 3, 10, 15, 1, 8],
                        },
                        'walk-in': {
                          month: [1, 5, 3, 15, 20, 2, 10],
                          week: [1, 3, 2, 10, 15, 1, 8],
                          day: [0, 1, 1, 5, 10, 0, 5],
                        },
                      }}
                    />
                  </Box> */}
              </Box>
              
        <Divider sx={{ my: 3, mx: 3 }} />


        {showCrumb && (
          <CustomBreadcrumbs
            heading="List"
            links={[
              {
                name: 'Dashboard',
                href: paths.dashboard.root,
              },
              {
                name: 'Check-Out',
                href: paths.dashboard.order.root,
              },
              { name: 'List' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />
        )}

        <Card>
          {/* <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'completed' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'cancelled' && 'error') ||
                      'default'
                    }
                  >
                    {['completed', 'pending', 'cancelled', 'refunded'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs> */}

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            dateError={dateError}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                      key={row._id}
                      row={{
                        id: row._id,
                        customerName: row.customer.name,
                        email: row.customer.email,
                        orderNumber: row.orderNumber,
                        checkIn: row.rooms?.[0]?.checkIn || 'N/A',
                        checkOut: row.rooms?.[0]?.checkOut || 'N/A',
                        totalPrice: row.rooms?.[0]?.tPrice || 'N/A',
                        status: row.status,
                        roomNumber: row.rooms?.[0]?.roomId?.roomNumber || 'N/A',
                        roomType: row.rooms?.[0]?.roomId?.roomType?.title || 'N/A',
                      }}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  let filteredData = inputData.map((el, index) => [el, index]);
  filteredData.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  filteredData = filteredData.map((el) => el[0]);

  // Filter by status (only show rows with status "paid")
  filteredData = filteredData.filter((booking) => booking.status === 'checkedIn');

  if (name) {
    filteredData = filteredData.filter(
      (booking) =>
        booking.customer.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((booking) => booking.status === status);
  }

  return filteredData;
}

OrderListView.propTypes = {
  showCrumb: PropTypes.bool,
};

