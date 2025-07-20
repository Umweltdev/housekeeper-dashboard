/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetUser } from 'src/api/user';
import { useGetBooking } from 'src/api/booking';

import UserNewEditForm from '../user-new-edit-form';
// import { get } from 'lodash';

// ----------------------------------------------------------------------

export default function TaskEditView({ id }) {
  const settings = useSettingsContext();
  const { booking } = useGetBooking(id);
  const { user } = useGetUser(id);

  console.log(booking);

  // const getUserDetails = async (userId) => {
  //   try {
  //     const response = await axiosInstance.get(`/api/user/${userId}`);
  //     setCurrentUser(response.data);
  //     // console.info('DATA', response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   getUserDetails(id);
  // }, [id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Task Update"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Task',
            href: paths.dashboard.task.root,
          },
          { name: 'Task List' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={booking} />
    </Container>
  );
}

TaskEditView.propTypes = {
  id: PropTypes.string,
};
