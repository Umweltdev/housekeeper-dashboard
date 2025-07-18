/* eslint-disable no-plusplus */
/* eslint-disable perfectionist/sort-imports */

import Container from '@mui/material/Container';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useGetBookings } from 'src/api/booking';
import { useGetUsers } from 'src/api/user';
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from 'src/assets/illustrations';

import { useSettingsContext } from 'src/components/settings';

import { parseISO, endOfMonth, startOfMonth, isWithinInterval } from 'date-fns';
import { OrderListView } from 'src/sections/order/view';

import { useGetRooms } from 'src/api/room';
import { useGetInvoices } from 'src/api/invoice';

import BookingBooked from '../booking-booked';
import BookingAvailable from '../booking-available';
import BookingTotalIncomes from '../booking-total-incomes';
import BookingWidgetSummary from '../booking-widget-summary';
import BookingCheckInWidgets from '../booking-check-in-widgets';

// ----------------------------------------------------------------------
function getStatusData(bookings) {
  const statusCounts = bookings.reduce((acc, booking) => {
    const { status } = booking;
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status]++;
    return acc;
  }, {});

  // Convert statusCounts into the data format expected by BookingBooked
  return Object.keys(statusCounts).map((status) => ({
    status,
    quantity: statusCounts[status],
    value: (statusCounts[status] / bookings.length) * 100,
  }));
}
// -------------------------------------------

const SPACING = 3;

export default function OverviewBookingView() {
  const settings = useSettingsContext();
  const { bookings } = useGetBookings();
  const { invoices } = useGetInvoices();
  const { users } = useGetUsers();
  const { rooms } = useGetRooms();

  console.log(invoices);

  // console.log(bookings);

  // -----------------------------------------------------

  // GET isAvailable and Available lenght
  let availableCount = 0;
  let unavailableCount = 0;
  if (rooms && Array.isArray(rooms)) {
    availableCount = rooms.filter((room) => room.isAvailable).length;
    unavailableCount = rooms.filter((room) => !room.isAvailable).length;
  }

  // ----------------------------------------------------

  // GET sum total of all bookings
  let sumAmount = 0;
  if (bookings && Array.isArray(bookings)) {
    sumAmount = bookings.reduce((total, booking) => {
      const price = parseFloat(booking.totalPrice) || 0;
      return total + price;
    }, 0);
  }

  // ------------------------------------------------------

  // Get the total price of the currnt month
  const startOfThisMonth = startOfMonth(new Date());
  const endOfThisMonth = endOfMonth(new Date());

  // Calculate total price for bookings in the current month
  let monthlyTotalPrice = 0;

  if (bookings && Array.isArray(bookings)) {
    monthlyTotalPrice = bookings
      .filter((booking) => {
        // Parse `updatedAt` and check if it falls within the current month
        const updatedAtDate = parseISO(booking.updatedAt);
        return isWithinInterval(updatedAtDate, {
          start: startOfThisMonth,
          end: endOfThisMonth,
        });
      })
      .reduce((total, booking) => {
        const price = parseFloat(booking.totalPrice) || 0; // Handle non-numeric or missing values
        return total + price;
      }, 0);
  }

  // console.log('Total Price for Current Month:', monthlyTotalPrice);

  //--------------------------------------------------------
  // Booking Status
  const bookingStatusData = invoices && Array.isArray(invoices) ? getStatusData(invoices) : [];
  // console.log(bookingStatusData);

  // --------------------------------------------------------
  // GET the total price from pending, total price from paid
  let paidTotalPrice = 0;
  let pendingTotalPrice = 0;

  if (invoices && Array.isArray(invoices)) {
    // Filter and calculate the sum for "Paid"
    paidTotalPrice = invoices
      .filter((invoice) => invoice.status === 'paid')
      .reduce((total, invoice) => total + (parseFloat(invoice.totalAmount) || 0), 0);

    // Filter and calculate the sum for "Pending"
    pendingTotalPrice = invoices
      .filter((invoice) => invoice.status === 'pending')
      .reduce((total, invoice) => total + (parseFloat(invoice.totalAmount) || 0), 0);
  }

  // console.log('Total Price (Paid):', paidTotalPrice);
  // console.log('Total Price (Pending):', pendingTotalPrice);

  // console.log(bookings.map((booking) => booking.status));
  // 68287dd465f94587a8ff7e8f479df049

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={SPACING} disableEqualOverflow>
        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Total Booking"
            total={bookings.length}
            icon={<BookingIllustration />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            naira="₦"
            title="Total Rooms Sold"
            total={sumAmount}
            icon={<CheckInIllustration />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <BookingWidgetSummary
            title="Customers"
            total={users.length}
            icon={<CheckoutIllustration />}
          />
        </Grid>

        <Grid container xs={12}>
          <Grid container xs={12} md={8}>
            <Grid xs={12} md={6}>
              <BookingTotalIncomes
                title="Monthly Total Income"
                total={monthlyTotalPrice}
                naira="₦"
                percent={2.6}
                chart={{
                  series: [
                    { x: 2016, y: 111 },
                    { x: 2017, y: 136 },
                    { x: 2018, y: 76 },
                    { x: 2019, y: 108 },
                    { x: 2020, y: 74 },
                    { x: 2021, y: 54 },
                    { x: 2022, y: 57 },
                    { x: 2023, y: 84 },
                  ],
                }}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <BookingBooked title="Booked" data={bookingStatusData} />
            </Grid>

            <Grid xs={12}>
              <BookingCheckInWidgets
                chart={{
                  series: [
                    {
                      label: 'Paid',
                      percent:
                        Math.round((paidTotalPrice / (paidTotalPrice + pendingTotalPrice)) * 100) ||
                        0,
                      total: paidTotalPrice,
                    },
                    {
                      label: 'Pending for payment',
                      percent:
                        Math.round(
                          (pendingTotalPrice / (paidTotalPrice + pendingTotalPrice)) * 100
                        ) || 0,
                      total: pendingTotalPrice,
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>

          <Grid xs={12} md={4}>
            <BookingAvailable
              title="Rooms Available"
              chart={{
                series: [
                  { label: 'Sold out', value: unavailableCount },
                  { label: 'Available', value: availableCount },
                ],
              }}
            />

            {/* <BookingCustomerReviews
              title="Customer Reviews"
              subheader={`${_bookingReview.length} Reviews`}
              list={_bookingReview}
              sx={{ mt: SPACING }}
            /> */}
          </Grid>
        </Grid>

        <Grid xs={12}>
          {/* <BookingNewest title="Newest Booking" subheader={bookings.length} list={bookings} /> */}
        </Grid>

        <Grid xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Booking Details
          </Typography>
          <OrderListView />{' '}
        </Grid>
      </Grid>
    </Container>
  );
}
