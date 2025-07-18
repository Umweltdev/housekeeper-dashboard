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

import { useGetRooms } from 'src/api/room';
import { useGetRoomType } from 'src/api/roomType';

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

import RoomTableRow from './room-table-row';

const ROOM_TABLE_HEAD = [
  { id: 'title', label: 'Title' },
  { id: 'rooms', label: 'Rooms Available' },
  { id: 'price', label: 'Price' },
  { id: 'accomodation', label: 'Max Occupancy' },
  { id: 'description', label: 'Description' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

export default function RoomTableView() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const confirm = useBoolean();

  const { rooms } = useGetRooms();
  const { roomType } = useGetRoomType();

  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (rooms && roomType) {
      const updatedRoomType = roomType.map((type) => {
        const roomsForType = rooms.filter((room) => room.roomType === type._id);
        const roomsAvailable = roomsForType.length;
        return { ...type, roomsAvailable };
      });
      setTableData(updatedRoomType);
    }
  }, [rooms, roomType]);

  // Filter data based on search query and selected filter
  const filteredData = tableData.filter((row) => {
    const matchesSearch = row.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || row._id === filterType;
    return matchesSearch && matchesFilter;
  });

  const table = useTable();
  const settings = useSettingsContext();
  const denseHeight = table.dense ? 52 : 72;
  const notFound = !filteredData.length;

  const handleDeleteRow = useCallback(
    (id) => {
      setTableData((prevData) => prevData.filter((row) => row.id !== id));
      enqueueSnackbar('Room deleted successfully!');
      confirm.onFalse();
    },
    [enqueueSnackbar, confirm]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.room.edit(id));
    },
    [router]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset', mt: 5, width: '100%' }}>
          <Typography variant="h4" sx={{ pl: 2, mb: 2 }}>
            Rooms Inventory
          </Typography>

          {/* Search Bar and Filter Input */}
          <Stack direction="row" spacing={2} sx={{ px: 2, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search room types..."
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
              label="Filter by Room Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ width: 300 }}
            >
              <MenuItem value="all">All</MenuItem>
              {roomType.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  {type.title}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={ROOM_TABLE_HEAD}
                rowCount={filteredData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {filteredData
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <RoomTableRow
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, filteredData.length)}
                />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={filteredData.length}
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
        title="Delete Room"
        content="Are you sure you want to delete this room?"
        action={
          <Button variant="contained" color="error" onClick={() => confirm.onFalse()}>
            Delete
          </Button>
        }
      />
    </Container>
  );
}
