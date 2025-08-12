import sumBy from 'lodash/sumBy';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
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
import { useAuthContext } from 'src/auth/hooks';
import { useGetTasksByHousekeeper, useUpdateTask } from 'src/api/task';
import { useGetRoomType } from 'src/api/roomType';

import InvoiceTableToolbar from './invoice-table-toolbar';
import CleaningTaskTableRow from './cleaning-task-edit-row';
import InvoiceTableFiltersResult from './invoice-table-filters-result';

// Utility function to truncate text
const truncateText = (text, maxLength = 20) => {
  if (!text) return 'No description';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'room', label: 'Room' },
  { id: 'category', label: 'Room Type' },
  { id: 'description', label: 'Task Description' },
  { id: 'dueDate', label: 'Due Date' },
  { id: 'priority', label: 'Priority' },
  { id: 'status', label: 'Cleaning Status' },
  { id: '', label: '' },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function InvoiceListViewEdit() {
  const { enqueueSnackbar } = useSnackbar();
  const { user, authenticated } = useAuthContext();

  // console.log('User from context:', user);

  const housekeeperId = user?.id || user?._id;
  // console.log('HOUSEKEEPER ID:', housekeeperId);

  const { tasks, tasksLoading, tasksError, refreshTasks } = useGetTasksByHousekeeper(housekeeperId);

  console.log('TASKS:::>tasks', tasks);

  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });
  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [roomTypes, setRoomTypes] = useState({}); // Store room type data by ID

  // Fetch room types
  const { roomType: fetchedRoomTypes } = useGetRoomType();

  const {
    mutate: updateTask,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateTask(housekeeperId);

  useEffect(() => {
    if (fetchedRoomTypes && !tasksLoading && !tasksError) {
      const roomTypeMap = fetchedRoomTypes.reduce((acc, roomType) => {
        acc[roomType._id] = roomType.title;
        return acc;
      }, {});
      setRoomTypes(roomTypeMap);
    }
  }, [fetchedRoomTypes, tasksLoading, tasksError]);

  useEffect(() => {
    if (tasks && !tasksLoading && !tasksError) {
      const taskArray = tasks.data || (Array.isArray(tasks) ? tasks : []);
      setTableData(
        taskArray.map((task) => ({
          ...task,
          room: task.roomId.roomNumber,
          category: roomTypes[task.roomId.roomType?._id || task.roomId.roomType] || 'Unknown',
          description: truncateText(task.status.detailedIssues[0]?.issue),
          status: task.status.statusType, // Ensure status is the statusType string
        }))
      );
    }
  }, [tasks, tasksLoading, tasksError, roomTypes]);

  const [filters, setFilters] = useState(defaultFilters);
  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
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
    !!filters.name ||
    !!filters.service.length ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status) => tableData.filter((item) => item.status === status).length;

  const TABS = [
    { value: 'all', label: 'All Tasks', color: 'default', count: tableData.length },
    {
      value: 'cleaned',
      label: 'Cleaned',
      color: 'success',
      count: getInvoiceLength('cleaned'),
    },
    {
      value: 'inspected',
      label: 'Inspected',
      color: 'info',
      count: getInvoiceLength('inspected'),
    },
    {
      value: 'dirty',
      label: 'Dirty',
      color: 'error',
      count: getInvoiceLength('dirty'),
    },
  ];

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
    (id) => {
      setTableData((prev) => prev.filter((row) => row._id !== id));
      enqueueSnackbar('Deleted Successfully!');
      refreshTasks(); // Refresh tasks after deletion
      confirm.onFalse();
    },
    [enqueueSnackbar, confirm, refreshTasks]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row._id));
    enqueueSnackbar('Delete success!');
    setTableData(deleteRows);
    refreshTasks(); // Refresh tasks after bulk deletion
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData, refreshTasks]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.task.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleUpdateStatus = useCallback(
    async (taskId, newStatus) => {
      try {
        const updatedTask = {
          status: {
            statusType: newStatus,
            description: '',
            maintenanceAndDamages: [],
            detailedIssues: [],
          },
        };
        await updateTask(updatedTask, housekeeperId);
        enqueueSnackbar(`Status updated to ${newStatus} successfully!`, { variant: 'success' });
        refreshTasks(); // Refresh the task list
      } catch (error) {
        enqueueSnackbar('Failed to update status', { variant: 'error' });
        console.error('Update status error:', error);
      }
    },
    [updateTask, enqueueSnackbar, refreshTasks, housekeeperId]
  );

  return (
    <Card>
      <Tabs
        value={filters.status}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            iconPosition="end"
            icon={
              <Label
                variant={
                  ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                }
                color={tab.color}
              >
                {tab.count}
              </Label>
            }
          />
        ))}
      </Tabs>

      <InvoiceTableToolbar
        filters={filters}
        onFilters={handleFilters}
        dateError={dateError}
        serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option?.name)}
      />

      {canReset && (
        <InvoiceTableFiltersResult
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
              dataFiltered.map((row) => row._id)
            )
          }
          action={
            <Stack direction="row">
              <Tooltip title="Sent">
                <IconButton color="primary">
                  <Iconify icon="iconamoon:send-fill" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download">
                <IconButton color="primary">
                  <Iconify icon="eva:download-outline" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton color="primary">
                  <Iconify icon="solar:printer-minimalistic-bold" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />

        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
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
                  dataFiltered.map((row) => row._id)
                )
              }
            />

            <TableBody>
              {dataFiltered.map((row) => (
                <CleaningTaskTableRow
                  key={row._id}
                  row={row}
                  selected={table.selected.includes(row._id)}
                  onSelectRow={() => table.onSelectRow(row._id)}
                  onEditRow={() => handleEditRow(row._id)}
                  onDeleteRow={() => handleDeleteRow(row._id)}
                  onUpdateStatus={handleUpdateStatus}
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
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

  if (!Array.isArray(inputData)) {
    console.error('inputData is not an array:', inputData);
    return [];
  }

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (invoice) =>
        invoice?.room?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice?.category?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    if (status === 'high') {
      inputData = inputData.filter((task) => task.priority === 'high');
    } else {
      inputData = inputData.filter((task) => task.status === status);
    }
  }

  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items?.some((filterItem) => service.includes(filterItem.service))
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => isBetween(invoice.dueDate, startDate, endDate));
    }
  }

  return inputData;
}
