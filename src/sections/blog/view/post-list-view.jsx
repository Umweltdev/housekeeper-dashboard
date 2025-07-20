/* eslint-disable perfectionist/sort-imports */
import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { _roles } from 'src/_mock';

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

import { useGetBookings } from 'src/api/booking';

import UserTableFiltersResult from 'src/sections/task/user-table-filters-result';
import PostTableToolbar from '../post-table-toolbar';
import UserTableRow from '../post-table-row';
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
  startDate: null,
  endDate: null,
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

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await axiosInstance.delete(`/api/booking/${id}`);
        enqueueSnackbar('Deleted Successfully!', { variant: 'success' });
        setTableData((prevData) => prevData.filter((row) => row._id !== id));
        refreshBookings();
      } catch (error) {
        console.error(error);
      }
    },
    [refreshBookings, enqueueSnackbar]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.booking.details(id));
    },
    [router]
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

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'History', href: paths.dashboard.booking.root },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <PostTableToolbar filters={filters} onFilters={handleFilters} roleOptions={_roles} />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
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
                      <UserTableRow
                        key={row._id}
                        row={{
                          id: row._id,
                          customerName: row.customer.name,
                          email: row.customer.email,
                          orderNumber: row.orderNumber,
                          status: row.totalPrice.toLocaleString(),
                          phoneNumber: row.customer.phone,
                          roomImg: row.rooms?.[0]?.roomId?.roomType?.images[0] || 'N/A',
                          floor: row.rooms?.[0]?.roomId?.floor || 'N/A',
                          stats: row.status,
                          checkIn: row.rooms?.[0]?.checkIn,
                          checkOut: row.rooms?.[0]?.checkOut,
                          roomNumber: row.rooms?.[0]?.roomId?.roomNumber || 'N/A',
                          roomType: row.rooms?.[0]?.roomId?.roomType?.title || 'N/A',
                        }}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
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

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, startDate, endDate } = filters;

  let filteredData = inputData.map((el, index) => [el, index]);
  filteredData.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  filteredData = filteredData.map((el) => el[0]);

  filteredData = filteredData.filter((booking) => booking.status === 'checkedOut');

  if (name) {
    filteredData = filteredData.filter((booking) =>
      booking.customer.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((booking) => booking.status === status);
  }

  // Date range filtering
  if (startDate && endDate) {
    filteredData = filteredData.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate);
    });
  } else if (startDate) {
    filteredData = filteredData.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= new Date(startDate);
    });
  } else if (endDate) {
    filteredData = filteredData.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate <= new Date(endDate);
    });
  }

  return filteredData;
}

UserListView.propTypes = {
  // Add any props your component receives here
};
