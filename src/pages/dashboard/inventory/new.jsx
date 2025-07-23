import { Helmet } from 'react-helmet-async';

import { UserCreateView } from 'src/sections/task/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Request for Inventory</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
