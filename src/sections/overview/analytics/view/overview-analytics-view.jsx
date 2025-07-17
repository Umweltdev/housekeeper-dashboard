import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { bgcolor, Box, useTheme } from '@mui/system';
import { Button, colors, MenuItem, Select } from '@mui/material';
import { useGetRooms } from 'src/api/room';
import { useGetRoomType } from 'src/api/roomType';
import { useGetBookings } from 'src/api/booking';
import { useGetFloors } from 'src/api/floor';

import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { info, success, warning } from 'src/theme/palette';

// import AnalyticsNews from '../analytics-news';
// import AnalyticsTasks from '../analytics-tasks';
// import AnalyticsCurrentVisits from '../analytics-current-visits';
// import AnalyticsOrderTimeline from '../analytics-order-timeline';
// import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
// import AnalyticsTrafficBySite from '../analytics-traffic-by-site';
// import AnalyticsCurrentSubject from '../analytics-current-subject';
// import AnalyticsConversionRates from '../analytics-conversion-rates';
// import CheckInAnalytics from './checkin-analytics';
import AnalyticsAggregateChart from '../analytics-aggregate-chart';
import AnalyticsAverageTimeChart from '../analytics-average-time-chart';
import AnalyticsPeakChart from '../analytics-peak-chart';
import AppWidgetSummaryReservation from '../../app/app-widget-summary-reservation';
import AppWidgetSummaryTotal from '../../app/app-widget-summary-total';
import AnalyticsSimpleCardChart from '../analytics-simple-card-chart';
import AnalyticsConversionRates from '../analytics-conversion-rates';
import {
  BOOKING_LEAD_TIME_DATA,
  cancellationData,
  dummyInquiryData,
  dummyResolutionTimeData,
  guestSatisfactionData,
  inquiryTypeData,
  RESERVATION_CHANNEL_DATA,
  reservationsData,
  resolutionTimeData,
  roomStatusDiscrepancyData,
  totalComplaints,
  totalRevenueData,
} from './dummData';

import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsStackChart from '../analytics-stack-chart';
import AnalyticsStackBarByFloor from '../analytic-stack-bar-chart';
import RoomStatusDifferentialChart from '../analytics-room-status-diff-chart';
import RoomStatusDiscrepancyChart from '../analytics-room-status-descripancy-chart';
import AnalyticsVerticalChart from '../analytics-vertical-chart';
import InquiriesChart from '../analytics-Inquiry-chart';
import InquiryResolutionTimeChart from '../analytics-average-resolution-time-chart';
import InquiryTypeChart from '../analytics-inquiry-type-chart';
import AnalyticsResolutionTimeCard from '../analytics-resolution-time-card';
import AnalyticsSatisfactionDonutChart from '../analytics-satisfaction-donut-chart';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const { bookings } = useGetBookings();
  const { rooms } = useGetRooms();
  const { roomType } = useGetRoomType();
  const { floor } = useGetFloors();
  const [range, setRange] = useState('week');
  const [leadRange, setLeadRange] = useState('week');

  console.log(bookings);
  console.log(floor);

  console.log(rooms);
  console.log(roomType);

  const checkInRef = useRef(null);
  const reservationRef = useRef(null);
  const checkOutRef = useRef(null);
  const roomStatusRef = useRef(null);
  const guestInquiryRef = useRef(null);
  const paymentRef = useRef(null);

  const handleScrollTo = (section) => {
    if (section === 'checkin' && checkInRef.current) {
      checkInRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'checkout' && checkOutRef.current) {
      checkOutRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'reservation' && reservationRef.current) {
      reservationRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'roomstatus' && roomStatusRef.current) {
      roomStatusRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'guestinquiry' && guestInquiryRef.current) {
      guestInquiryRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'payment' && paymentRef.current) {
      paymentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const theme = useTheme();
  // console.log(bookings);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >
            Hi, Welcome back 👋
          </Typography>

          <Select
            defaultValue=""
            onChange={(e) => handleScrollTo(e.target.value)}
            displayEmpty
            size="small"
            sx={{ width: 200 }}
          >
            <MenuItem value="" disabled>
              Jump to section...
            </MenuItem>
            <MenuItem value="checkin">Check-In Analytics</MenuItem>
            <MenuItem value="checkout">Check-Out Analytics</MenuItem>
            <MenuItem value="reservation">Reservation Analytics</MenuItem>
            <MenuItem value="roomstatus">Room Status</MenuItem>
            <MenuItem value="guestinquiry">Guest Inquiry</MenuItem>
            <MenuItem value="payment">Payment</MenuItem>
          </Select>
        </Box>

        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Current Check In"
              total={`${bookings.length}`}
              icon={<img alt="icon" src="/assets/icons/glass/bed.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Reservations"
              total={1352831}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Current Occupied Rooms"
              total={1723315}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Invoice"
              total={234}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
            />
          </Grid>
        </Grid>
      </Container>
      {/* <Divider sx={{ my: 2 }} /> */}
      <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={checkInRef}>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: 5,
              mb: 2,
            }}
          >
            Guest Check-In Analytics
          </Typography>
          <Button component={Link} to="/dashboard/user/list" variant="contained">
            Guest Check-In Page
          </Button>
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} lg={6} md={3}>
            <AnalyticsAggregateChart
              title="Current CheckIn"
              bookings={bookings}
              floorsData={floor}
            />
          </Grid>

          <Grid xs={12} lg={6} md={3}>
            <AnalyticsAverageTimeChart title="Avg Check-In Time by Hour" bookings={bookings} />
          </Grid>

          <Grid xs={12} lg={6} md={3}>
            <AnalyticsPeakChart title="Peak Check-In Time" bookings={bookings} />
          </Grid>

          <Grid xs={12} lg={6} md={3}>
            <AppWidgetSummaryTotal
              title="Early CheckIn Request"
              percent={2.6}
              totals={{
                month: [10, 20, 15, 25, 17, 14].reduce((a, b) => a + b, 0),
                week: [5, 8, 6].reduce((a, b) => a + b, 0),
                day: [3, 2].reduce((a, b) => a + b, 0),
              }}
              chartData={{
                month: [10, 20, 15, 25],
                week: [5, 8, 6],
                day: [3, 2],
              }}
            />

            <Box mt={3}>
              <AppWidgetSummaryReservation
                title="Reservation Channel | Dummy Data"
                percent={2.6}
                totals={{
                  online: { month: 150, week: 40, day: 5 },
                  incall: { month: 100, week: 30, day: 3 },
                  'walk-in': { month: 50, week: 10, day: 2 },
                }}
                chartData={{
                  online: {
                    month: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                    week: [3, 10, 8, 40, 50, 7, 22],
                    day: [1, 5, 3, 15, 20, 2, 10],
                  },
                  incall: {
                    month: [3, 10, 8, 40, 50, 7, 22],
                    week: [2, 5, 6, 20, 30, 4, 15],
                    day: [1, 2, 3, 10, 15, 1, 8],
                  },
                  'walk-in': {
                    month: [1, 5, 3, 15, 20, 2, 10],
                    week: [1, 3, 2, 10, 15, 1, 8],
                    day: [0, 1, 1, 5, 10, 0, 5],
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Checkout */}
      <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={checkOutRef}>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: 5,
              mb: 2,
            }}
          >
            Guest Check-Out Analytics
          </Typography>
          <Button component={Link} to="/dashboard/order" variant="contained">
            Guest Check-Out Page
          </Button>
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} lg={6} md={3}>
            <AnalyticsAggregateChart title="Current Check-Out" bookings={bookings} />
          </Grid>

          <Grid xs={12} lg={6} md={3}>
            <AnalyticsAverageTimeChart title="Avg Check-Out Time by Hour" bookings={bookings} />
          </Grid>

          <Grid xs={12} lg={6} md={3}>
            <AnalyticsPeakChart title="Peak Check-Out Time" bookings={bookings} />
          </Grid>
          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsSimpleCardChart title="Peak Check-Out Request" />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Reservation */}
      <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={reservationRef}>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: 5,
              mb: 2,
            }}
          >
            Reservation Analytics
          </Typography>
          <Button component={Link} to="/dashboard/calendar" variant="contained">
            View Reservations
          </Button>
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsVerticalChart
              sx={{
                bgcolor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText,
                height: 230,
              }}
              bookingData={reservationsData}
              title="Reservations"
            />
            <Box sx={{ mt: 2 }}>
              <AnalyticsVerticalChart
                sx={{ height: 230 }}
                bookingData={cancellationData}
                title="Cancellation/No Shows"
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>

          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsConversionRates
              sx={{ height: 470 }}
              title="Average length of stay"
              subheader="(+43%) than last year"
              chart={{
                series: [
                  { label: 'Jan', value: 310 },
                  { label: 'Feb', value: 130 },
                  { label: 'Mar', value: 148 },
                  { label: 'Apr', value: 170 },
                  { label: 'May', value: 140 },
                  { label: 'Jun', value: 280 },
                  { label: 'Jul', value: 390 },
                  { label: 'Aug', value: 400 },
                  { label: 'Sept', value: 330 },
                  { label: 'Oct', value: 380 },
                  { label: 'Nov', value: 310 },
                  { label: 'DEC', value: 420 },
                ],
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>

          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsWebsiteVisits
              title="Reservation Channels"
              subheader="Across call, walk-in, and online"
              chart={{
                labels: RESERVATION_CHANNEL_DATA[range].labels,
                series: RESERVATION_CHANNEL_DATA[range].series,
                colors: RESERVATION_CHANNEL_DATA[range].colors,
              }}
              action={
                <Select
                  size="small"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  sx={{ mr: 2 }}
                >
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              }
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsWebsiteVisits
              title="Booking Lead Time"
              subheader="Average number of days guests book in advance"
              chart={{
                labels: BOOKING_LEAD_TIME_DATA[leadRange].labels,
                series: BOOKING_LEAD_TIME_DATA[leadRange].series,
                colors: BOOKING_LEAD_TIME_DATA[leadRange].colors,
              }}
              action={
                <Select
                  size="small"
                  value={leadRange}
                  onChange={(e) => setLeadRange(e.target.value)}
                  sx={{ mr: 2 }}
                >
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              }
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Room Status */}
      <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={roomStatusRef}>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: 5,
              mb: 2,
            }}
          >
            Room Status
          </Typography>
          <Button component={Link} to="/dashboard/room" variant="contained">
            Manage Rooms
          </Button>
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} lg={6} md={3}>
            <AnalyticsStackChart
              title="Room Availability by Type"
              subheader="Shows available vs unavailable rooms by category"
              rooms={rooms}
              roomTypes={roomType}
            />
          </Grid>
          <Grid xs={12} lg={6} md={3}>
            <AnalyticsStackBarByFloor
              title="Room Availability by Floor"
              subheader="Tracks available vs unavailable rooms per floor"
              rooms={rooms}
            />
          </Grid>
          <Grid xs={12} lg={6} md={3}>
            <RoomStatusDifferentialChart
              title="Room Operational Status"
              subheader="Differentials of Occupied, Clean, Dirty, and Maintenance"
              rooms={rooms}
            />
          </Grid>
          <Grid xs={12} lg={6} md={3} sx={{ position: 'relative' }}>
            <RoomStatusDiscrepancyChart
              title="Desk Discrepancies"
              subheader="Comparison between Housekeeping and Front Desk room statuses"
              chart={roomStatusDiscrepancyData}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={guestInquiryRef}>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: 5,
              mb: 2,
            }}
          >
            Guest Inquiries
          </Typography>
          <Button component={Link} to="/dashboard/inquiries" variant="contained">
            View Inquiries
          </Button>
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} lg={6} md={3} position="relative">
            <InquiriesChart
              title="Customer Inquiries"
              subheader="Inquiries per Hour / Day / Week"
              chart={dummyInquiryData}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} lg={6} md={3} position="relative">
            <InquiryResolutionTimeChart
              title="Avg. Resolution Time"
              subheader="Per inquiry"
              chart={dummyResolutionTimeData}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} lg={6} md={3}>
            <Grid xs={12} lg={6} position="relative">
              <InquiryTypeChart
                title="Types of Inquiries"
                subheader="Based on recent guest interactions"
                chart={inquiryTypeData}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',

                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'auto', // blocks interaction with chart
                  borderRadius: 2, // match card radius
                }}
              >
                <Typography
                  variant="h6"
                  color="text.secondary"
                  bgcolor="rgba(255,255,255,0.8)"
                  p={3}
                  borderRadius={2}
                >
                  In Development
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={paymentRef}>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: 5,
              mb: 2,
            }}
          >
            Payments (Finance)
          </Typography>
          <Button component={Link} to="/dashboard/finance" variant="contained">
            Payment Records
          </Button>
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsVerticalChart
              sx={{
                bgcolor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText,
                height: 200,
              }}
              bookingData={totalRevenueData || 0}
              title="Total revenue"
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <AnalyticsVerticalChart
                sx={{ height: 200, color: '#fff' }}
                bookingData={totalRevenueData}
                title="Average Transaction Value"
              />
            </Box>
          </Grid>

          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsConversionRates
              sx={{ height: 450 }}
              title="payments by method"
              subheader="Breakdown of payments by method"
              chart={{
                series: [
                  { label: 'Cash', value: 2370310 },
                  { label: 'Credit Card', value: 1305001 },
                  { label: 'Paystack', value: 2748002 },
                ],
                colors: [info.main, warning.main, success.main],
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={paymentRef}>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mt: 5,
              mb: 2,
            }}
          >
            Number of Complaints
          </Typography>
          <Button component={Link} to="/dashboard/complaints" variant="contained">
            View Complaints
          </Button>
        </Grid>

        <Grid container spacing={3}>
          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsVerticalChart
              sx={{
                height: 200,
              }}
              bookingData={totalComplaints || 0}
              title="Number of complaints"
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsResolutionTimeCard
              sx={{ height: 200 }}
              title="Avg. Complaint Resolution Time"
              resolutionData={resolutionTimeData}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsSatisfactionDonutChart
              title="Guest Satisfaction (Complaint Handling)"
              subheader="Distribution of feedback ratings"
              data={guestSatisfactionData}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} lg={6} md={3} position="relative">
            <AnalyticsConversionRates
              sx={{ height: 450 }}
              title="Types of complaints"
              subheader="Breakdown of complaints based on different factors"
              chart={{
                series: [
                  { label: 'Cleanliness', value: 2 },
                  { label: 'Noise', value: 1 },
                  { label: 'Service', value: 4 },
                  { label: 'Delays', value: 2 },
                ],
                colors: [info.main, warning.main, success.main, success.main],
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',

                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto', // blocks interaction with chart
                borderRadius: 2, // match card radius
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                bgcolor="rgba(255,255,255,0.8)"
                p={3}
                borderRadius={2}
              >
                In Development
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
