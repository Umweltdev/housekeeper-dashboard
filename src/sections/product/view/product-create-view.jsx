import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import ProductNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

export default function ProductCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ProductNewEditForm />
    </Container>
  );
}
