import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetRoom } from 'src/api/room';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TourNewEditForm from '../tour-new-edit-form';

// ----------------------------------------------------------------------

export default function TourEditView({ id }) {
  const settings = useSettingsContext();

  const { room } = useGetRoom(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Tour',
            href: paths.dashboard.room.root,
          },
          { name: room?.roomName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TourNewEditForm currentTour={room} />
    </Container>
  );
}

TourEditView.propTypes = {
  id: PropTypes.string,
};
