import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import {
  Card,
  Table,
  Stack,
  Button,
  MenuItem,
  Container,
  TableBody,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetBookings } from 'src/api/booking';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import ReservationTableRow from './reservation-table-row';

const RESERVATION_TABLE_HEAD = [
  { id: 'customerName', label: 'Guest Name' },
  { id: 'orderNumber', label: 'Order Number' },
  { id: 'totalPrice', label: 'Total Amount' },
  { id: 'status', label: 'Status' },
  { id: 'paymentMode', label: 'Payment Mode' },
  { id: 'roomsCount', label: 'Rooms Booked' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

export default function ReservationTableView({ reservations }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const confirm = useBoolean();
  const { refreshBookings } = useGetBookings();

  const [tableData, setTableData] = useState(reservations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  useEffect(() => {
    setTableData(reservations);
  }, [reservations]);

  // Filter data based on search query and selected month
  const filteredData = tableData.filter((row) => {
    const matchesSearch = row.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by month
    const checkInDate = new Date(row?.rooms[0]?.checkIn);
    const selectedMonthNumber = parseInt(selectedMonth, 10);

    const matchesMonth = selectedMonth === 'all' || checkInDate.getMonth() === selectedMonthNumber;

    return matchesSearch && matchesMonth;
  });

  // Sort the filteredData by checkIn date in descending order
  const sortedData = filteredData.sort(
    (a, b) => new Date(b.rooms[0].checkIn) - new Date(a.rooms[0].checkIn)
  );

  const table = useTable();
  const settings = useSettingsContext();
  const denseHeight = table.dense ? 52 : 72;
  const notFound = !sortedData.length;

  const handleDeleteRow = useCallback(
    (id) => {
      setTableData((prevData) => prevData.filter((row) => row._id !== id));
      enqueueSnackbar('Deleted Successfully!');
      confirm.onFalse();
    },
    
    [enqueueSnackbar, confirm]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.reservation.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.reservation.details(id));
    },
    [router]
    
  );

  useEffect(() => {
    console.log('Reservations Data:', reservations);
    const transformedReservations = reservations.map((reservation) => ({
      ...reservation,
      customer: reservation.customer || { name: 'Unknown Customer' },
      rooms: reservation.rooms || [],
    }));
    setTableData(transformedReservations);
    refreshBookings();
  }, [reservations, refreshBookings]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset', mt: 5, width: '100%' }}>
          <Typography variant="h4" sx={{ pl: 2, mb: 2 }}>
            Reservations
          </Typography>

          {/* Search Bar and Month Filter */}
          <Stack direction="row" spacing={2} sx={{ px: 2, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by guest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              fullWidth
              label="Filter by Month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value="all">All Months</MenuItem>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={RESERVATION_TABLE_HEAD}
                rowCount={sortedData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {sortedData
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ReservationTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                      />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, sortedData.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={sortedData.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Reservation"
        content="Are you sure you want to delete this reservation?"
        action={
          <Button variant="contained" color="error" onClick={() => confirm.onFalse()}>
            Delete
          </Button>
        }
      />
    </Container>
  );
}

ReservationTableView.propTypes = {
  reservations: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      customer: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      orderNumber: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      paymentMode: PropTypes.string.isRequired,
      totalPrice: PropTypes.number.isRequired,
      rooms: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          roomId: PropTypes.shape({
            roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            roomType: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
          checkIn: PropTypes.string.isRequired,
          checkOut: PropTypes.string.isRequired,
          tPrice: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};
