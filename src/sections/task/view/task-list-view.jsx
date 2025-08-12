/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useMemo } from 'react';
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

import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable, getComparator } from 'src/components/table';

import InvoiceListViewEdit from 'src/sections/task/view/invoice-list-viewEdit';
import AppWidgetSummary from 'src/sections/overview/app/app-widget-summary';
import { useAuthContext } from 'src/auth/hooks';

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
  role: [],
  status: 'all',
};

// MonthSelector component
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
  const confirm = useBoolean();
  const [tableData, setTableData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const theme = useTheme();
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedMonth, setSelectedMonth] = useState('all');

  const { user, authenticated } = useAuthContext();
  const housekeeperId = user?._id || user?.id;

  // Debug logs for user and housekeeperId
  console.log('User from context:', user);
  console.log('HOUSEKEEPER ID:', housekeeperId);

  // Fetch tasks directly with axiosInstance
  useEffect(() => {
    if (!housekeeperId || !authenticated) {
      console.log('Skipping task fetch: No housekeeperId or not authenticated');
      return;
    }

    const fetchTasks = async () => {
      setTasksLoading(true);
      setTasksError(null);
      try {
        console.log('Fetching tasks for housekeeperId:', housekeeperId);
        const response = await axiosInstance.get(`/api/task/housekeeper/${housekeeperId}`);
        console.log('Tasks response:', response.data);
        setTasks(response.data.data || []);
        setTableData(response.data.data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasksError(error.message || 'Failed to fetch tasks');
        setTasks([]);
        setTableData([]);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, [housekeeperId, authenticated]);

  // Calculate status counts using useMemo
  const statusCounts = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return { cleaned: 0, dirty: 0, inspected: 0 };

    return tasks.reduce(
      (acc, task) => {
        const status = task.status.statusType;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { cleaned: 0, dirty: 0, inspected: 0 }
    );
  }, [tasks]);

  // Debug log for tasks and status counts
  console.log('TASKS::::ANALYTICS==>', tasks);
  console.log('STATUS COUNTS:', statusCounts);

  // Filter table data
  const dataFiltered = applyFilter({
    inputData: tasks,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row._id));
    enqueueSnackbar('Delete success!');
    setTableData(deleteRows);
    setTasks(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  // if (!authenticated || !user) {
  //   return (
  //     <Container>
  //       <Box>Please log in to view tasks</Box>
  //     </Container>
  //   );
  // }

  if (tasksLoading) {
    return (
      <Container>
        <Box>Loading tasks...</Box>
      </Container>
    );
  }
  if (tasksError) {
    return (
      <Container>
        <Box>Error loading tasks: {tasksError}</Box>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="My Task"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Task' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

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
              total: tasks.length || 0,
              chart: {
                colors: [theme.palette.success.light, theme.palette.success.main],
                series: [3, 5, 2, 4, 6, 2, 1, 1, 0],
              },
            },
            {
              title: 'Cleaned Tasks',
              icon: 'solar:check-circle-bold-duotone',
              iconColor: 'success.main',
              total: statusCounts.cleaned !== undefined ? statusCounts.cleaned : 0,
              chart: {
                colors: [theme.palette.success.light, theme.palette.success.main],
                series: [1, 2, 3, 4, 5],
              },
            },

            {
              title: 'Dirty Tasks',
              icon: 'iconoir:priority-high-solid',
              color: 'error.main',
              total: statusCounts.dirty !== undefined ? statusCounts.dirty : 0,
              chart: {
                colors: [theme.palette.error.light, theme.palette.error.main],
                series: [3, 5, 2, 4, 6],
              },
            },
            {
              title: 'Inspected Tasks',
              icon: 'grommet-icons:in-progress',
              color: 'info.main',
              total: statusCounts.inspected !== undefined ? statusCounts.inspected : 0,
              chart: {
                colors: [theme.palette.info.light, theme.palette.info.main],
                series: [4, 2, 6, 8, 5],
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

  if (name) {
    filteredData = filteredData.filter((task) =>
      task.roomId?.roomNumber?.toString().toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((task) => task.status.statusType === status);
  }

  return filteredData;
}

UserListView.propTypes = {
};
