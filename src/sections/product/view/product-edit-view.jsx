import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetEvent } from 'src/api/events';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

export default function ProductEditView({ slug }) {
  const settings = useSettingsContext();

  const { event: currentProduct } = useGetEvent(slug);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Event',
            href: paths.dashboard.event.root,
          },
          { name: currentProduct?.title },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}

ProductEditView.propTypes = {
  slug: PropTypes.string,
};
