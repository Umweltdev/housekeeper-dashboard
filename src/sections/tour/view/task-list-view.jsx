/* eslint-disable perfectionist/sort-imports */
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';



import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useGetRoomType } from 'src/api/roomType';
import TourList from '../tour-list';
import AnalyticTable from './analytic-table';

// import TourFilters from '../tour-filters';
// import TourFiltersResult from '../tour-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  // destination: [],
  // tourGuides: [],
  // services: [],
  // startDate: null,
  // endDate: null,
  publish: 'all',
};

// ----------------------------------------------------------------------

export default function TourListView() {
  const settings = useSettingsContext();

  // const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [search, setSearch] = useState({
    query: '',
    results: [],
  });

  const { roomType, refreshRoomsType } = useGetRoomType();

  const [filters, setFilters] = useState(defaultFilters);

  // const dateError = isAfter(filters.startDate, filters.endDate);
  // console.log(roomType);

  const dataFiltered = applyFilter({
    inputData: roomType,
    filters,
    sortBy,
    // dateError,
  });

  // console.log(dataFiltered);

  // const canReset =
  //   !!filters.destination.length ||
  //   !!filters.tourGuides.length ||
  //   !!filters.services.length ||
  //   (!!filters.startDate && !!filters.endDate);

  const notFound = !dataFiltered?.length;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = roomType.filter(
          (tour) => tour.title.toLowerCase().indexOf(search.query.toLowerCase()) !== -1
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [search.query, roomType]
  );
  // console.log(rooms[0]._id)
  const handleFilterPublish = useCallback(
    (event, newValue) => {
      handleFilters('publish', newValue);
    },
    [handleFilters]
  );
  // const renderFilters = (
  //   <Stack
  //     spacing={3}
  //     justifyContent="space-between"
  //     alignItems={{ xs: 'flex-end', sm: 'center' }}
  //     direction={{ xs: 'column', sm: 'row' }}
  //   >
  //     <Stack direction="row" spacing={1} flexShrink={0}>
  //       <TourFilters
  //         open={openFilters.value}
  //         onOpen={openFilters.onTrue}
  //         onClose={openFilters.onFalse}
  //         //
  //         filters={filters}
  //         onFilters={handleFilters}
  //         //
  //         canReset={canReset}
  //         onResetFilters={handleResetFilters}
  //         //
  //         serviceOptions={TOUR_SERVICE_OPTIONS.map((option) => option.label)}
  //         tourGuideOptions={_tourGuides}
  //         destinationOptions={countries.map((option) => option.label)}
  //         //
  //         dateError={dateError}
  //       />

  //       <TourSort sort={sortBy} onSort={handleSortBy} sortOptions={TOUR_SORT_OPTIONS} />
  //     </Stack>
  //   </Stack>
  // );

  const renderResults = (
    <>
      {/* <Tabs
        value={filters.publish}
        onChange={handleFilterPublish}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {['all', 'published', 'draft'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === filters?.publish) && 'filled') || 'soft'}
                color={(tab === 'published' && 'info') || 'default'}
              >
                {tab === 'all' && roomType?.length}

                {tab === 'published' &&
                  roomType?.filter((post) => post.publish === 'published').length}

                {tab === 'draft' && roomType?.filter((post) => post.publish === 'draft')?.length}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs> */}
      {/* <TourFiltersResult
        filters={filters}
        onResetFilters={handleResetFilters}
        //
        canReset={canReset}
        onFilters={handleFilters}
        //
        results={dataFiltered.length}
      /> */}
    </>
  );

  // console.log(dataFiltered)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Room Categories"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Room',
            href: paths.dashboard.room.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.room.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Category
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <AnalyticTable />
        {/* {renderFilters} */}

        {renderResults}
      </Stack>

      {notFound && <EmptyContent title="No Data" filled sx={{ py: 10 }} />}

      <TourList tours={dataFiltered} refreshRoomsType={refreshRoomsType} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy, dateError }) => {
  const { publish } = filters;

  // const tourGuideIds = tourGuides.map((tourGuide) => tourGuide.id);

  // // SORT BY
  // if (sortBy === 'latest') {
  //   inputData = orderBy(inputData, ['createdAt'], ['desc']);
  // }

  // if (sortBy === 'oldest') {
  //   inputData = orderBy(inputData, ['createdAt'], ['asc']);
  // }

  // if (sortBy === 'popular') {
  //   inputData = orderBy(inputData, ['totalViews'], ['desc']);
  // }

  // // FILTERS
  // if (destination.length) {
  //   inputData = inputData.filter((tour) => destination.includes(tour.destination));
  // }

  // if (tourGuideIds.length) {
  //   inputData = inputData.filter((tour) =>
  //     tour.tourGuides.some((filterItem) => tourGuideIds.includes(filterItem.id))
  //   );
  // }

  // if (services.length) {
  //   inputData = inputData.filter((tour) => tour.services.some((item) => services.includes(item)));
  // }

  // if (!dateError) {
  //   if (startDate && endDate) {
  //     inputData = inputData.filter((tour) =>
  //       isBetween(startDate, tour.available.startDate, tour.available.endDate)
  //     );
  //   }
  // }

  // if (publish !== 'all') {
  //   inputData = inputData.filter((post) => post.publish === publish);
  // }

  return inputData;
};
// import React from 'react';
// import CalenderSchedule from './render-res-calender';

// export default function TourListView() {
//   return (
//     <div>
//       <CalenderSchedule />
//     </div>
//   );
// }
