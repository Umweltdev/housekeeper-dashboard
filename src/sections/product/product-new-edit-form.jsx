/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';


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

import { useGetProducts } from 'src/api/product';

import AppWidgetSummaryTotal from 'src/sections/overview/app/app-widget-summary-total';

import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'subject', label: 'Subject' },
  { id: 'status', label: 'Status', width: 150 },
  { id: 'priority', label: 'Priority', width: 150 },
  { id: 'category', label: 'Category', width: 150 },
  { id: 'createdAt', label: 'Date Created', width: 130 },
  { id: '', width: 100 },
];

const defaultFilters = {
  name: '',
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

export default function ProductNewEditForm() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { products, refreshProducts } = useGetProducts();
  const [tableData, setTableData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const theme = useTheme();
  const [filters, setFilters] = useState(defaultFilters);

  console.log(products)

  useEffect(() => {
    setTableData(products);
  }, [products]);

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

const countComplaintsByStatus = (complaints, status) => complaints.filter(complaint => complaint.status === status).length;

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
        await axiosInstance.delete(`/api/complaints/${id}`);
        enqueueSnackbar('Deleted Successfully!', { variant: 'success' });
        setTableData((prevData) => prevData.filter((row) => row._id !== id));
        refreshProducts();
      } catch (error) {
        console.error(error);
      }
    },
    [refreshProducts, enqueueSnackbar]
  );

 const handleEditRow = useCallback(
  (id) => {
    router.push(paths.dashboard.complaint.edit(id)); // Update this path to match your routes
  },
  [router]
);

const handleViewRow = useCallback(
  (id) => {
    router.push(paths.dashboard.complaint.details(id)); // Update this path to match your routes
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



const calculateResolutionRate = (complaints) => {
  if (!complaints || complaints.length === 0) return 0;
  
  const totalResolved = countComplaintsByStatus(complaints, 'resolved');
  const totalClosed = countComplaintsByStatus(complaints, 'closed');
  const totalCompleted = totalResolved + totalClosed;
  
  return Math.round((totalCompleted / complaints.length) * 100);
};

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
       <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap', mx: 3 }}>
  {/* Total Complaints Widget */}
  <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
    <AppWidgetSummaryTotal
      title="Total Complaints"
      percent={tableData.length > 0 ? 
        ((tableData.length - products.length) / products.length * 100).toFixed(1) : 
        0
      }
      totals={{ 
        month: tableData.length,
        week: Math.ceil(tableData.length / 4.345), // Average weeks in month
        day: Math.ceil(tableData.length / 30) // Average days in month
      }}
      chartData={{
        month: [tableData.length],
        week: [Math.ceil(tableData.length / 4)],
        day: [Math.ceil(tableData.length / 30)]
      }}
      onTimeframeChange={setSelectedTimeframe}
      selectedTimeframe={selectedTimeframe}
    />
  </Box>

  {/* In-Progress Complaints Widget */}
  <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
    <AppWidgetSummaryTotal
      title="In-Progress"
      percent={tableData.length > 0 ? 
        (countComplaintsByStatus(tableData, 'in-progress') / tableData.length * 100).toFixed(1) : 
        0
      }
      totals={{ 
        month: countComplaintsByStatus(tableData, 'in-progress'),
        week: Math.ceil(countComplaintsByStatus(tableData, 'in-progress') / 4),
        day: Math.ceil(countComplaintsByStatus(tableData, 'in-progress') / 30)
      }}
      chartData={{
        month: [countComplaintsByStatus(tableData, 'in-progress')],
        week: [Math.ceil(countComplaintsByStatus(tableData, 'in-progress') / 4)],
        day: [Math.ceil(countComplaintsByStatus(tableData, 'in-progress') / 30)]
      }}
      chartColors={[theme.palette.info.light, theme.palette.info.main]}
    />
  </Box>

  {/* Resolved Complaints Widget */}
  <Box sx={{ flex: 1, minWidth: '300px', maxWidth: '100%' }}>
  <AppWidgetSummaryTotal
    title="Resolved Complaints"
    percent={tableData.length > 0 ? 
      ((countComplaintsByStatus(tableData, 'resolved') + 
       countComplaintsByStatus(tableData, 'closed')) / 
       tableData.length * 100).toFixed(1) : 
      0
    }
    totals={{ 
      month: countComplaintsByStatus(tableData, 'resolved') + 
             countComplaintsByStatus(tableData, 'closed'),
      week: Math.ceil((countComplaintsByStatus(tableData, 'resolved') + 
             countComplaintsByStatus(tableData, 'closed')) / 4),
      day: Math.ceil((countComplaintsByStatus(tableData, 'resolved') + 
            countComplaintsByStatus(tableData, 'closed')) / 30)
    }}
    chartData={{
      month: [countComplaintsByStatus(tableData, 'resolved') + 
              countComplaintsByStatus(tableData, 'closed')],
      week: [Math.ceil((countComplaintsByStatus(tableData, 'resolved') + 
             countComplaintsByStatus(tableData, 'closed')) / 4)],
      day: [Math.ceil((countComplaintsByStatus(tableData, 'resolved') + 
            countComplaintsByStatus(tableData, 'closed')) / 30)]
    }}
    chartColors={[theme.palette.success.light, theme.palette.success.main]}
  />
</Box>
</Box>

        <Divider sx={{ my: 3, mx: 3 }} />
        
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Complaints', href: paths.dashboard.booking.root },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
            statusOptions={[ 'open', 'in-progress', 'resolved']}
          />

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
          dataFiltered.map((row) => row._id)
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
              _id: row._id,
              subject: row.subject,
              description: row.description,
              status: row.status,
              priority: row.priority,
              category: row.category,
              images: row.images || [],
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
              user: row.user
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
  const { name, status } = filters;

  let filteredData = inputData.map((el, index) => [el, index]);
  filteredData.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });

  filteredData = filteredData.map((el) => el[0]);

  if (name) {
    filteredData = filteredData.filter(
      (complaint) => complaint.subject.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((complaint) => complaint.status === status);
  }

  return filteredData;
}

ProductNewEditForm.propTypes = {
  // Add any props your component receives here
};