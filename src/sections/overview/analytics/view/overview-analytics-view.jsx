import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';

import { Box, useTheme } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, Select, MenuItem } from '@mui/material';

import { useGetRooms } from 'src/api/room';
import { useGetFloors } from 'src/api/floor';
import { useGetBookings } from 'src/api/booking';
import { useGetRoomType } from 'src/api/roomType';
import { info, success, warning } from 'src/theme/palette';

import { useSettingsContext } from 'src/components/settings';

// import AnalyticsNews from '../analytics-news';
// import AnalyticsTasks from '../analytics-tasks';
// import AnalyticsCurrentVisits from '../analytics-current-visits';
// import AnalyticsOrderTimeline from '../analytics-order-timeline';
// import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
// import AnalyticsTrafficBySite from '../analytics-traffic-by-site';
// import AnalyticsCurrentSubject from '../analytics-current-subject';
// import AnalyticsConversionRates from '../analytics-conversion-rates';
import InquiriesChart from '../analytics-Inquiry-chart';
import AnalyticsPeakChart from '../analytics-peak-chart';
import AnalyticsStackChart from '../analytics-stack-chart';
import InquiryTypeChart from '../analytics-inquiry-type-chart';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsVerticalChart from '../analytics-vertical-chart';
// import CheckInAnalytics from './checkin-analytics';
import AnalyticsAggregateChart from '../analytics-aggregate-chart';
import AnalyticsStackBarByFloor from '../analytic-stack-bar-chart';
import AnalyticsConversionRates from '../analytics-conversion-rates';
import AnalyticsSimpleCardChart from '../analytics-simple-card-chart';
import AppWidgetSummaryTotal from '../../app/app-widget-summary-total';
import AnalyticsAverageTimeChart from '../analytics-average-time-chart';
import AnalyticsResolutionTimeCard from '../analytics-resolution-time-card';
import RoomStatusDifferentialChart from '../analytics-room-status-diff-chart';
import AppWidgetSummaryReservation from '../../app/app-widget-summary-reservation';
import RoomStatusDiscrepancyChart from '../analytics-room-status-descripancy-chart';
import InquiryResolutionTimeChart from '../analytics-average-resolution-time-chart';
import AnalyticsSatisfactionDonutChart from '../analytics-satisfaction-donut-chart';
import MyPerformance from './my-performance';
import MySample from './my-sample';
import {
  inquiryTypeData,
  totalComplaints,
  cancellationData,
  dummyInquiryData,
  reservationsData,
  totalRevenueData,
  resolutionTimeData,
  guestSatisfactionData,
  BOOKING_LEAD_TIME_DATA,
  dummyResolutionTimeData,
  RESERVATION_CHANNEL_DATA,
  roomStatusDiscrepancyData,
} from './dummData';

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
            <MenuItem value="checkin">Task Analytics</MenuItem>
            <MenuItem value="checkout">Inventory Analytics</MenuItem>
            <MenuItem value="reservation">Schedule Analytics</MenuItem>
            <MenuItem value="roomstatus">Inventory Analytics</MenuItem>
            <MenuItem value="guestinquiry">Training Analytics</MenuItem>
          </Select>
        </Box>
      </Container>
      {/* <Divider sx={{ my: 2 }} /> */}
      <>
        <Box>
          <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={checkInRef}>
            <MyPerformance />
          </Container>
          <Container
            maxWidth={settings.themeStretch ? false : 'xl'}
            ref={checkInRef}
            sx={{ mt: 5 }}
          >
            <MySample />
          </Container>
        </Box>
      </>
    </>
  );
}
