/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Divider from '@mui/material/Divider';

import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable, getComparator } from 'src/components/table';

import { useGetInventoryByHousekeeper } from 'src/api/inventory';

import InvoiceListViewEdit from './invoice-list-viewEdit';
import InvoiceAnalytic from '../invoice-analytic';

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

export default function InventoryListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState([]);
  const theme = useTheme();
  const [filters, setFilters] = useState(defaultFilters);

  const { user } = useAuthContext();
  const houseKeeperId = user?._id;
  const { inventories } = useGetInventoryByHousekeeper(houseKeeperId);
  console.log('Inventories=[[[]]]==>', inventories);

  // Calculate status counts using useMemo
  const statusCounts = useMemo(() => {
    if (!inventories?.data || !Array.isArray(inventories.data)) {
      return { requested: 0, approved: 0, rejected: 0, received: 0 };
    }

    return inventories.data.reduce(
      (acc, inventory) => {
        const status = inventory.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { requested: 0, approved: 0, rejected: 0, received: 0 }
    );
  }, [inventories]);

  const totalInventories =
    (statusCounts.requested || 0) +
    (statusCounts.approved || 0) +
    (statusCounts.rejected || 0) +
    (statusCounts.received || 0);

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

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{}}>
          <CustomBreadcrumbs
            heading="Inventory"
            links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'List' }]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="material-symbols:add-box" />}
            onClick={() => router.push('/dashboard/inventory/request')}
          >
            Request Inventory
          </Button>
        </Stack>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          gap={2}
        >
          {[
            {
              title: 'Requested',
              total: statusCounts.requested || 0,
              percent: totalInventories
                ? (((statusCounts.requested || 0) / totalInventories) * 100).toFixed(1)
                : 0,
              price: 0,
              icon: 'tdesign:task',
              color: theme.palette.info.main,
            },
            {
              title: 'Approved',
              total: statusCounts.approved || 0,
              percent: totalInventories
                ? (((statusCounts.approved || 0) / totalInventories) * 100).toFixed(1)
                : 0,
              price: 0,
              icon: 'ic:round-check-circle',
              color: theme.palette.success.main,
            },
            {
              title: 'Rejected',
              total: statusCounts.rejected || 0,
              percent: totalInventories
                ? (((statusCounts.rejected || 0) / totalInventories) * 100).toFixed(1)
                : 0,
              price: 0,
              icon: 'material-symbols:cancel',
              color: theme.palette.error.main,
            },
            {
              title: 'Received',
              total: statusCounts.received || 0,
              percent: totalInventories
                ? (((statusCounts.received || 0) / totalInventories) * 100).toFixed(1)
                : 0,
              price: 0,
              icon: 'ph:package-bold',
              color: theme.palette.warning.main,
            },
          ].map((item) => (
            <InvoiceAnalytic
              key={item.title}
              title={item.title}
              total={item.total}
              percent={item.percent}
              price={item.price}
              icon={item.icon}
              color={item.color}
            />
          ))}
        </Stack>
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

InventoryListView.propTypes = {};
