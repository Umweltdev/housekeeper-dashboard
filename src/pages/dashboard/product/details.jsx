import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { ProductDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const params = useParams();

  const { slug } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Event Details</title>
      </Helmet>

      <ProductDetailsView slug={`${slug}`} />
    </>
  );
}
