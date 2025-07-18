import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetInvoice } from 'src/api/invoice';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceNewEditForm from '../invoice-new-edit-form';

// ----------------------------------------------------------------------

export default function InvoiceEditView({ id }) {
  const settings = useSettingsContext();

  const { invoice: currentInvoice } = useGetInvoice(id);
  console.log(currentInvoice);

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
            name: 'Invoice',
            href: paths.dashboard.invoice.root,
          },
          { name: currentInvoice?.invoiceNumber },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InvoiceNewEditForm currentInvoice={currentInvoice} />
    </Container>
  );
}

InvoiceEditView.propTypes = {
  id: PropTypes.string,
};
