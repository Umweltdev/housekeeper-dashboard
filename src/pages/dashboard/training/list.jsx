import { Helmet } from 'react-helmet-async';

import {  TrainingListView } from 'src/sections/training/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Training</title>
      </Helmet>

      <TrainingListView />
    </>
  );
}
