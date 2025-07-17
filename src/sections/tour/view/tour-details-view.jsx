import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

// eslint-disable-next-line import/no-unresolved
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetRoomsByRoomType } from 'src/api/room';

import { useSettingsContext } from 'src/components/settings';

import TourDetailsToolbar from '../tour-details-toolbar';
import TourDetailsContent from '../tour-details-content';
// import TourDetailsBookers from '../tour-details-bookers';

// ----------------------------------------------------------------------

export default function TourDetailsView({ id }) {
  const settings = useSettingsContext();

  const { rooms } = useGetRoomsByRoomType(id);
  const [searchResults, setSearchResults] = useState(rooms || []);

  const handleSearch = (filteredRooms) => {
    setSearchResults(filteredRooms);
  };

  const [currentTab] = useState('content');

  const handleChangePublish = useCallback((newValue) => {
    // setPublish(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <TourDetailsToolbar
        backLink={paths.dashboard.room.root}
        editLink={paths.dashboard.room.edit(id)}
        rooms={rooms}
        onSearch={handleSearch}
      />

      {currentTab === 'content' && rooms && <TourDetailsContent tour={rooms} />}
    </Container>
  );
}

TourDetailsView.propTypes = {
  id: PropTypes.string,
};
