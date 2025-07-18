import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import axiosInstance from 'src/utils/axios';

import { useGetBooking } from 'src/api/booking';
import { useGetInvoice } from 'src/api/invoice';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import OrderDetailsInfo from '../order-details-info';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';

// import OrderDetailsHistory from '../order-details-history';

// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();

  // const currentOrder = _orders.filter((order) => order.id === id)[0];
  const { booking: currentOrder } = useGetBooking(id);
  console.log(currentOrder)

  const { invoice: currentOrders} = useGetInvoice(id);

  const [status, setStatus] = useState('');
  const handleChangeStatus = useCallback(
    async (newValue) => {
      if (newValue) {
        await axiosInstance.put(`/api/booking/${id}`, { status: newValue });
      }
      setStatus(newValue);
    },
    [id]
  );
  useEffect(() => {
    if (currentOrder?.status) {
      setStatus(currentOrder?.status);
    }
  }, [currentOrder?.status]);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={currentOrder?.invoiceNumber}
        createdAt={currentOrder?.createdAt}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <OrderDetailsInfo
            invoiceTo={currentOrder}
            // delivery={currentOrder.delivery}
            // payment={currentOrder?.payment}
            // shippingAddress={currentOrder.shippingAddress}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            {/* <OrderDetailsItems
              customerName={currentOrder?.customer?.name}
              email={currentOrder?.customer?.email}
              bookingID={currentOrder.orderNumber}
              checkIn= {currentOrder.rooms?.[0]?.checkIn}
              checkOut= {currentOrder.rooms?.[0]?.checkOut}
              NIN={currentOrder?.customer?.id}
              // subTotal={currentOrder.subTotal}
              totalAmount={currentOrder?.rooms?.[0]?.tPrice}
            /> */}
            <OrderDetailsItems
              items={currentOrder?.rooms || []}  // Ensure items (rooms) are passed
              totalAmount={currentOrder?.rooms?.reduce((sum, room) => sum + (room?.tPrice || 0), 0)} 
              totalPrice={currentOrder?.rooms?.reduce((sum, room) => sum + (room?.tPrice || 0), 0)}
          />

            {/* <OrderDetailsHistory history={currentOrder.history} /> */}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
};
