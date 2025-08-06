/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTable, getComparator } from 'src/components/table';

import InvoiceListViewEdit from 'src/sections/task/view/invoice-list-viewEdit';

import { useGetBookings } from 'src/api/booking';

import AppWidgetSummary from 'src/sections/overview/app/app-widget-summary';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customerName', label: 'Customer Name' },
  { id: 'status', label: 'Price (₦)', width: 170 },
  { id: 'orderNumber', label: 'Booking ID', width: 200 },
  { id: 'roomType', label: 'Room Type', width: 200 },
  { id: 'roomNumber', label: 'Room Number', width: 150 },
  { id: '', width: 100 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// MonthSelector component moved outside
const MonthSelector = ({ value, onChange }) => (
  <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
    <InputLabel>Month</InputLabel>
    <Select value={value} label="Month" onChange={(e) => onChange(e.target.value)}>
      <MenuItem value="all">All Months</MenuItem>
      <MenuItem value="1">January</MenuItem>
      <MenuItem value="2">February</MenuItem>
      <MenuItem value="3">March</MenuItem>
      <MenuItem value="4">April</MenuItem>
      <MenuItem value="5">May</MenuItem>
      <MenuItem value="6">June</MenuItem>
      <MenuItem value="7">July</MenuItem>
      <MenuItem value="8">August</MenuItem>
      <MenuItem value="9">September</MenuItem>
      <MenuItem value="10">October</MenuItem>
      <MenuItem value="11">November</MenuItem>
      <MenuItem value="12">December</MenuItem>
    </Select>
  </FormControl>
);

MonthSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

// ----------------------------------------------------------------------

export default function UserListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { bookings, refreshBookings } = useGetBookings();
  const [tableData, setTableData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const theme = useTheme();
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setTableData(bookings);
  }, [bookings]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
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

  const calculateDaysDifference = (date1, date2) => {
    const timeDifference = new Date(date1) - new Date(date2);
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  };

  // Initialize data structures
  const monthlyGuests = {};
  const weeklyGuests = {};
  const dailyGuests = {};
  const leadTimeData = [];
  const lengthOfStayData = [];

  // Process bookings data
  bookings.forEach((booking) => {
    booking.rooms.forEach((room) => {
      const lengthOfStay = calculateDaysDifference(room.checkOut, room.checkIn);
      lengthOfStayData.push(lengthOfStay);

      const leadTime = calculateDaysDifference(room.checkIn, booking.createdAt);
      leadTimeData.push(leadTime);

      const checkInDate = new Date(room.checkIn);
      const monthKey = `${checkInDate.getFullYear()}-${checkInDate.getMonth() + 1}`;
      const weekKey = `${checkInDate.getFullYear()}-W${getWeekNumber(checkInDate)}`;
      const dayKey = `${checkInDate.getFullYear()}-${
        checkInDate.getMonth() + 1
      }-${checkInDate.getDate()}`;

      monthlyGuests[monthKey] = (monthlyGuests[monthKey] || 0) + 1;
      weeklyGuests[weekKey] = (weeklyGuests[weekKey] || 0) + 1;
      dailyGuests[dayKey] = (dailyGuests[dayKey] || 0) + 1;
    });
  });

  // Extract check-in dates
  const checkInDates = bookings
    .filter((booking) => booking.status === 'checkedIn')
    .flatMap((booking) => booking.rooms.map((room) => new Date(room.checkIn || booking.createdAt)));

  // Calculate monthly averages
  const calculateMonthlyAverage = () => {
    if (checkInDates.length === 0) return 0;

    const filteredDates =
      selectedMonth === 'all'
        ? checkInDates
        : checkInDates.filter((date) => date.getMonth() + 1 === Number(selectedMonth));

    if (filteredDates.length === 0) return 0;

    const minDate = new Date(Math.min(...filteredDates));
    const maxDate = new Date(Math.max(...filteredDates));
    const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24) || 1;

    return (filteredDates.length / totalDays).toFixed(2);
  };

  const averageCheckInsPerDay = calculateMonthlyAverage();
  const averageCheckInsPerHour =
    checkInDates.length > 0 ? (averageCheckInsPerDay / 24).toFixed(2) : 0;

  const guestChartData = {
    month: Object.values(monthlyGuests),
    week: Object.values(weeklyGuests),
    day: Object.values(dailyGuests),
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="My Task"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            // { name: 'Check-In', href: paths.dashboard.booking.root },
            { name: 'Task' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {/* <Divider /> */}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'stretch',
            rowGap: 2,
            columnGap: 2,
            mb: 4,
          }}
        >
          {[
            {
              title: 'Total Task',
              icon: 'bi:list-task',
              iconColor: 'info.main',
              total: 23,
              chart: {
                colors: [theme.palette.success.light, theme.palette.success.main],
                series: [3, 5, 2, 4, 6, 2, 1, 1, 0],
              },
            },
            {
              title: 'High Priority',
              icon: 'iconoir:priority-high-solid',
              iconColor: 'error.main',
              total: 12,
              chart: {
                colors: [theme.palette.success.light, theme.palette.success.main],
                series: [3, 5, 2, 4, 6, 2, 1],
              },
            },
            {
              title: 'In Progress',
              icon: 'grommet-icons:in-progress',
              iconColor: 'warning.main',
              total: 18,
              percent: +8,
              chart: {
                colors: [theme.palette.warning.light, theme.palette.warning.main],
                series: [4, 2, 6, 8, 5],
              },
            },
            {
              title: 'Completed Tasks',
              icon: 'solar:check-circle-bold-duotone',
              iconColor: 'success.main',
              total: 4,
              percent: +12,
              chart: {
                colors: [theme.palette.success.light, theme.palette.success.main],
                series: [1, 2, 3, 4, 5],
              },
            },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                flexBasis: { xs: '100%', sm: '48%', md: 'calc(33% - 16px)', lg: '100px' },
                minWidth: '100px',
                maxWidth: '100%',
                flexGrow: 1,
              }}
            >
              <AppWidgetSummary {...item} />
            </Box>
          ))}
        </Box>

        <InvoiceListViewEdit />
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

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  let filteredData = inputData.map((el, index) => [el, index]);
  filteredData.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  filteredData = filteredData.map((el) => el[0]);

  filteredData = filteredData.filter((booking) => booking.status === 'paid');

  if (name) {
    filteredData = filteredData.filter((booking) =>
      booking.customer.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((booking) => booking.status === status);
  }

  return filteredData;
}

UserListView.propTypes = {
  // Add any props your component receives here
};
