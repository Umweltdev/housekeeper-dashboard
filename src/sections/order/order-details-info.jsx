import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo({ invoiceTo, delivery, payment, shippingAddress }) {
  const renderCustomer = (
    <Stack spacing={2} sx={{ p: 3 }}>
        {/* Avatar at the top */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            alt={invoiceTo?.customer?.name}
            src={invoiceTo?.avatarUrl}
            sx={{ width: 80, height: 80 }} // Larger avatar size
          />
        </Box>

        {/* Customer Info */}
        <Stack spacing={1} alignItems="center" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{invoiceTo?.customer?.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {invoiceTo?.customer?.email}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {invoiceTo?.phoneNumber}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Customer Phone number: {invoiceTo?.customer?.phone}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Booking ID: {invoiceTo?.orderNumber}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            National ID: {invoiceTo?.customer?.id}
          </Typography>

          {/* Add to Blacklist Button */}
          {/* <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 2 }}
          >
            Add to Blacklist
          </Button> */}
        </Stack>
      </Stack>
  );

  const renderPayment = (
    <>
      <CardHeader
        title="Payment"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
        <Box component="span" sx={{ color: 'text.secondary', flexGrow: 1 }}>
          Phone number
        </Box>
        **** **** **** 6633
        <Iconify icon="logos:mastercard" width={24} sx={{ ml: 0.5 }} />
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      {/* Uncomment if you want to include payment details */}
      {/* <Divider sx={{ borderStyle: 'dashed' }} />
      {renderPayment} */}
    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  invoiceTo: PropTypes.object,
  delivery: PropTypes.object,
  payment: PropTypes.object,
  shippingAddress: PropTypes.object,
};