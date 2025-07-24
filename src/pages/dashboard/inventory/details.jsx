import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { UserDetailsView } from 'src/sections/inventory/view';

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: New Inventory</title>
      </Helmet>

      <UserDetailsView  />
    </>
  );
}
