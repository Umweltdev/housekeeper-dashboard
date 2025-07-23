import { Helmet } from 'react-helmet-async';

import { UserListView } from 'src/sections/inventory/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Inventory List</title>
      </Helmet>

      <UserListView />
    </>
  );
}
