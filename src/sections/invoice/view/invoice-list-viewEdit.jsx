import sumBy from 'lodash/sumBy';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';
import { isAfter, isBetween } from 'src/utils/format-time';

import { useGetInvoices } from 'src/api/invoice';
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Typography } from '@mui/material';
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

import InvoiceAnalytic from '../invoice-analytic';
import CleaningTaskTableRow from '../cleaning-task-edit-row';
import InvoiceTableToolbar from '../invoice-table-toolbar';
import InvoiceTableFiltersResult from '../invoice-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'room', label: 'Room' },
  { id: 'category', label: 'Room Category' },
  { id: 'description', label: 'Task Description' },
  { id: 'dueDate', label: 'Due Date' },
  { id: 'priority', label: 'Priority' },
  { id: 'status', label: 'Cleaning Status' },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

const CLEANING_TASKS = [
  {
    id: '1',
    room: '101',
    category: 'Standard',
    description: 'Full cleaning including bathroom',
    dueDate: '2023-06-15T10:00:00',
    priority: 'High',
    status: 'pending',
    createDate: '2023-06-10T08:00:00',
  },
  {
    id: '2',
    room: '202',
    category: 'Deluxe',
    description: 'Change bed sheets and towels',
    dueDate: '2023-06-15T12:00:00',
    priority: 'Medium',
    status: 'pending',
    createDate: '2023-06-10T09:00:00',
  },
  {
    id: '3',
    room: '305',
    category: 'Suite',
    description: 'Deep cleaning after checkout',
    dueDate: '2023-06-14T14:00:00',
    priority: 'High',
    status: 'completed',
    createDate: '2023-06-09T10:00:00',
  },
  {
    id: '4',
    room: '107',
    category: 'Standard',
    description: 'Quick refresh between guests',
    dueDate: '2023-06-16T09:00:00',
    priority: 'Low',
    status: 'pending',
    createDate: '2023-06-11T08:00:00',
  },
  {
    id: '5',
    room: '210',
    category: 'Deluxe',
    description: 'VIP guest preparation',
    dueDate: '2023-06-13T16:00:00',
    priority: 'High',
    status: 'completed',
    createDate: '2023-06-08T11:00:00',
  },
  {
    id: '6',
    room: '115',
    category: 'Standard',
    description: 'Regular daily cleaning',
    dueDate: '2023-06-15T11:00:00',
    priority: 'Medium',
    status: 'pending',
    createDate: '2023-06-10T10:00:00',
  },
  {
    id: '7',
    room: '301',
    category: 'Suite',
    description: 'Special request: extra towels',
    dueDate: '2023-06-14T13:00:00',
    priority: 'Medium',
    status: 'completed',
    createDate: '2023-06-09T09:00:00',
  },
  {
    id: '8',
    room: '204',
    category: 'Deluxe',
    description: 'Full cleaning with carpet shampoo',
    dueDate: '2023-06-16T15:00:00',
    priority: 'High',
    status: 'pending',
    createDate: '2023-06-11T10:00:00',
  },
  {
    id: '9',
    room: '102',
    category: 'Standard',
    description: 'Checkout cleaning',
    dueDate: '2023-06-14T10:00:00',
    priority: 'Medium',
    status: 'completed',
    createDate: '2023-06-09T08:00:00',
  },
  {
    id: '10',
    room: '208',
    category: 'Deluxe',
    description: 'Prepare for long-term guest',
    dueDate: '2023-06-15T14:00:00',
    priority: 'High',
    status: 'pending',
    createDate: '2023-06-10T12:00:00',
  },
  {
    id: '11',
    room: '303',
    category: 'Suite',
    description: 'Full service with minibar restock',
    dueDate: '2023-06-16T11:00:00',
    priority: 'High',
    status: 'pending',
    createDate: '2023-06-11T09:00:00',
  },
  {
    id: '12',
    room: '110',
    category: 'Standard',
    description: 'Quick tidy up',
    dueDate: '2023-06-15T09:00:00',
    priority: 'Low',
    status: 'Completed',
    createDate: '2023-06-10T07:00:00',
  },
];
export default function InvoiceListViewEdit() {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const settings = useSettingsContext();

  const invoices = CLEANING_TASKS;

  console.log(invoices);

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const sortedInvoices = [...invoices].sort(
      (a, b) => new Date(b.createDate) - new Date(a.createDate)
    );
    setTableData(sortedInvoices);
  }, [invoices]);

  // I just want to get cancelled invoices here
  const cancelledInvoices = invoices
    .filter((invoice) => invoice.status === 'cancelled')
    .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  // console.log(cancelledInvoices);

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
    !!filters?.name ||
    !!filters.service.length ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalAmount'
    );

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    {
      value: 'paid',
      label: 'Completed',
      color: 'success',
      count: getInvoiceLength('paid'),
    },
    {
      value: 'pending',
      label: 'Pending',
      color: 'warning',
      count: getInvoiceLength('pending'),
    },
    {
      value: 'cancelled',
      label: 'High Priority',
      color: 'error',
      count: getInvoiceLength('cancelled'),
    },
    {
      value: 'refunded',
      label: 'Total task',
      color: 'default',
      count: getInvoiceLength('refunded'),
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
      setTableData((prev) => prev.filter((row) => row.id !== id));
      enqueueSnackbar('Deleted Successfully!');
      confirm.onFalse();
    },
    [enqueueSnackbar, confirm]
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

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.edit(id));
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

  return (
    <>
      {/* <Container maxWidth={settings.themeStretch ? false : 'lg'}> */}
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
          //
          dateError={dateError}
          serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option?.name)}
        />

        {canReset && (
          <InvoiceTableFiltersResult
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
            onSelectAllRows={(checked) => {
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              );
            }}
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
                    <CleaningTaskTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
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
      {/* </Container> */}

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

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

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
        invoice?.invoiceNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice?.invoiceTo?.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => service.includes(filterItem.service))
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((invoice) => isBetween(invoice.createDate, startDate, endDate));
    }
  }

  return inputData;
}
