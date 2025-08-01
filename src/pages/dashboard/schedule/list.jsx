import { Helmet } from 'react-helmet-async';

import { ScheduleListView } from 'src/sections/schedule/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Schedule</title>
      </Helmet>

      <ScheduleListView />
    </>
  );
}
