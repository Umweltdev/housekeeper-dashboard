import { Helmet } from 'react-helmet-async';

import { UserListView } from 'src/sections/task/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Task List</title>
      </Helmet>

      <UserListView />
    </>
  );
}
