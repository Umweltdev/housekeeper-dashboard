/* eslint-disable no-plusplus */
/* eslint-disable perfectionist/sort-imports */

import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { SeoIllustration } from 'src/assets/illustrations';

import { useSettingsContext } from 'src/components/settings';

import { fetcher, endpoints } from 'src/utils/axios';
import { useGetRooms } from 'src/api/room';
import { useGetUsers } from 'src/api/user';
import { useGetBookings } from 'src/api/booking';
import { useGetRoomType } from 'src/api/roomType';

import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const [invoiceData, setInvoiceData] = useState(0);
  const [roomData, setRoomData] = useState(0);
  const storedUserString = sessionStorage.getItem('user');
  const user = JSON.parse(storedUserString);
  const theme = useTheme();

  const settings = useSettingsContext();

  // Get total number of customers
  const { users } = useGetUsers();
  const { bookings } = useGetBookings();
  const { rooms } = useGetRooms();
  const { roomType } = useGetRoomType();

  console.log(rooms);

  const [checkInsPerDay, setCheckInsPerDay] = useState([]);
  const [peakPeriod, setPeakPeriod] = useState(null);

  useEffect(() => {
    if (users && users.length > 0) {
      const dailyCheckIns = {};

      users.forEach((u) => {
        if (u.status === 'Checked-in' && u.createdAt) {
          const checkInDate = dayjs(u.createdAt).format('YYYY-MM-DD');
          dailyCheckIns[checkInDate] = (dailyCheckIns[checkInDate] || 0) + 1;
        }
      });

      const checkInData = Object.entries(dailyCheckIns).map(([date, count]) => ({
        date,
        count,
      }));
      setCheckInsPerDay(checkInData);

      // Calculate Peak Period (Example - Day with most check-ins)
      let maxCheckIns = 0;
      let peakDay = null;

      Object.entries(dailyCheckIns).forEach(([date, count]) => {
        if (count > maxCheckIns) {
          maxCheckIns = count;
          peakDay = date;
        }
      });

      setPeakPeriod({ day: peakDay, count: maxCheckIns }); // Store peak period info
    }
  }, [users]);

  // Fetch total invoice from the backend
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // Fetch invoice data
        const invoice = await fetcher(endpoints.invoice.list);
        setInvoiceData(invoice); // Update state with the total number of invoice
        console.log(invoice);
      } catch (error) {
        console.error('Failed to fetch invoice:', error);
      }
    };

    fetchInvoice();
  }, []);

  useEffect(() => {
    if (Array.isArray(rooms) && Array.isArray(roomType)) {
      // Create a map of roomType IDs to titles
      const roomTypeMap = roomType.reduce((acc, type) => {
        acc[type._id] = type.title; // Assuming roomType objects have _id and title
        return acc;
      }, {});

      // Group rooms by roomType title
      const roomTypeCounts = rooms.reduce((acc, room) => {
        const typeTitle = roomTypeMap[room.roomType] || 'Unknown'; // Get the title using the ID
        acc[typeTitle] = (acc[typeTitle] || 0) + 1;
        return acc;
      }, {});

      // Transform data into chart-compatible format
      const transformedData = Object.entries(roomTypeCounts).map(([title, count]) => ({
        label: title, // Use roomType title as label
        value: count, // Number of rooms in this type
      }));

      setRoomData(transformedData);
    }
  }, [rooms, roomType]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.firstName} ${user?.lastName}`}
            description="Guests may forget what you said but they will never forget how you made them feel"
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                Go Now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Users"
            percent={2.6}
            total={users?.length || 0}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Booking"
            percent={0.2}
            total={bookings.length || 0}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Rooms"
            percent={-5.1}
            total={Array.isArray(rooms) ? rooms.length : 0}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Number of Check-ins per day"
            // total={checkInsPerDay.length > 0 ? checkInsPerDay[checkInsPerDay.length -1].count : 0} // Display last day check-in count as total
            total={checkInsPerDay.reduce((sum, day) => sum + day.count, 0) || 0}
            chart={{
              series: checkInsPerDay.map((item) => item.count), // Use check-in counts for the chart series
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Peak period"
            total={peakPeriod ? peakPeriod.count : 0} // Display the peak check-in count
            description={peakPeriod ? `Peak Day: ${peakPeriod.day}` : 'No check-ins found'} // Display the peak day
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: checkInsPerDay.map((item) => item.count),
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Number of in-person check-in"
            percent={-5.1}
            total={0}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Room Types"
            chart={{
              series: roomData,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Room Performance Index"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Superior Double Room',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'Standard Room',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                    {
                      name: 'Standard Single Room',
                      data: [40, 24, 33, 56, 47, 88, 99, 17, 45, 13, 96, 97],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Superior Double Room',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'Standard Room',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                    {
                      name: 'Standard Single Room',
                      data: [20, 24, 53, 56, 47, 38, 99, 17, 65, 13, 96, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} sx={{ width: '100%' }}>
          <AppNewInvoice
            title="New Invoice"
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'rooms', label: 'Rooms' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '', label: '' },
            ]}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Rated Meals" list={_appRelated} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
