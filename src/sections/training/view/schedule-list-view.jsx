import React, { useState, useEffect, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Grid, Card, Container, Typography, Pagination } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import StatWidget from '../stat-widget';
import { TRAINING_ITEMS } from '../training-items';
import TrainingModuleCard from '../training-module-card';
import TrainingKnowledgeBase from './training-knowledge-base';

const defaultFilters = { name: '', status: 'all' };

export default function ScheduleListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable({ defaultRowsPerPage: 6 });
  const settings = useSettingsContext();
  const router = useRouter();
  const theme = useTheme();

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setTableData(TRAINING_ITEMS);
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const handleViewRow = useCallback((url) => {
    if (url) window.open(url, '_blank');
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <CustomBreadcrumbs
          heading="Training & Resources"
          links={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'List' }]}
        />
      </Box>

      {/* Stat Widgets */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StatWidget
              title="Tasks Mastered"
              value={8}
              total={10}
              progress={80}
              icon="mdi:trophy-variant"
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatWidget
              title="Active Certifications"
              value={2}
              progress={50}
              icon="mdi:certificate"
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatWidget
              title="Training Time"
              value={45}
              unit="minutes this week"
              progress={75}
              icon="mdi:timer-sand"
              color="warning"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Training Modules */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Training Modules
        </Typography>

        <Grid container spacing={3}>
          {dataInPage.map((row) => (
            <Grid item xs={12} sm={6} md={4} key={row.id}>
              <TrainingModuleCard module={row} onView={() => handleViewRow(row.url)} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(dataFiltered.length / table.rowsPerPage)}
            page={table.page + 1}
            onChange={(e, page) => table.onChangePage(e, page - 1)}
            color="primary"
            shape="rounded"
          />
        </Box>
      </Card>

      {/* Knowledge Base and Safety Guidelines */}
      <Box sx={{ mt: 5 }}>
        <TrainingKnowledgeBase />
      </Box>
    </Container>
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
    filteredData = filteredData.filter((item) =>
      item.module.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  return filteredData;
}
