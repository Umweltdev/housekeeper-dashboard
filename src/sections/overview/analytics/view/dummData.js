import { grey } from '@mui/material/colors';

import { info, error, success, warning, secondary } from 'src/theme/palette';




export const RESERVATION_CHANNEL_DATA = {
  week: {
    labels: [
      '2025-04-28',
      '2025-04-29',
      '2025-04-30',
      '2025-05-01',
      '2025-05-02',
      '2025-05-03',
      '2025-05-04',
    ],
    series: [
      {
        name: 'Call In',
        type: 'line',
        data: [15, 20, 18, 22, 22, 20, 27],
        fill: 'solid',
      },
      {
        name: 'In Person',
        type: 'line',
        data: [8, 6, 10, 9, 7, 5, 6],
        fill: 'solid',
      },
      {
        name: 'Online',
        type: 'line',
        data: [25, 28, 30, 33, 15, 18, 20],
        fill: 'solid',
      },
    ],
    colors: ['#1976D2', '#9C27B0', '#FF9800'],
  },

  month: {
    labels: ['2025-04-01', '2025-04-08', '2025-04-15', '2025-04-22', '2025-04-29'],
    series: [
      {
        name: 'Call In',
        type: 'line',
        data: [100, 120, 110, 130, 105],
        fill: 'solid',
      },
      {
        name: 'In Person',
        type: 'line',
        data: [50, 60, 55, 70, 35],
        fill: 'solid',
      },
      {
        name: 'Online',
        type: 'line',
        data: [200, 220, 330, 250, 170],
        fill: 'solid',
      },
    ],
    colors: ['#1976D2', '#9C27B0', '#FF9800'],
  },

  year: {
    labels: ['2024-01-01', '2024-03-01', '2024-05-01', '2024-07-01', '2024-09-01', '2024-11-01'],
    series: [
      {
        name: 'Call In',
        type: 'line',
        data: [400, 450, 270, 300, 480, 520],
        fill: 'solid',
      },
      {
        name: 'In Person',
        type: 'line',
        data: [250, 260, 270, 380, 290, 300],
        fill: 'solid',
      },
      {
        name: 'Online',
        type: 'line',
        data: [300, 350, 200, 450, 300, 450],
        fill: 'solid',
      },
    ],
    colors: ['#1976D2', '#9C27B0', '#FF9800'],
  },
};

export const BOOKING_LEAD_TIME_DATA = {
  week: {
    labels: ['Apr 1–7', 'Apr 8–14', 'Apr 15–21', 'Apr 22–28'],
    series: [
      {
        name: 'Avg Lead Time',
        data: [18, 14, 9, 21], // Days
      },
    ],
    colors: ['#2065D1'],
  },
  month: {
    labels: ['January', 'February', 'March', 'April'],
    series: [
      {
        name: 'Avg Lead Time',
        data: [12, 17, 14, 20],
      },
    ],
    colors: ['#2065D1'],
  },
  year: {
    labels: ['2022', '2023', '2024', '2025'],
    series: [
      {
        name: 'Avg Lead Time',
        data: [15, 16, 20, 18],
      },
    ],
    colors: ['#2065D1'],
  },
};

export const reservationsData = {
  day: 4,
  week: 22,
  month: 97,
};

export const totalRevenueData = {
  day: 280000,
  week: 9405000,
  month: 42035000,
};

export const guestSatisfactionData = {
  satisfied: 120,
  neutral: 30,
  dissatisfied: 15,
};


export const totalComplaints = {
  day: 15,
  week: 34,
  month: 103,
};

export const resolutionTimeData = {
  day: 22,
  week: 30,
  month: 28,
};


export const averageData = {
  day: 387080,
  week: 9405800,
  month: 27004780,
};

export const cancellationData = {
  day: 1,
  week: 3,
  month: 7,
};

export const checkoutData = {
  day: 3,
  week: 12,
  month: 37,
};

export const roomStatusDiscrepancyData = {
  labels: ['Clean', 'In Maintenance', 'Occupied', 'Out of Order'],
  series: [
    {
      name: 'Front Desk',
      data: [35, 10, 40, 5],
    },
    {
      name: 'Housekeeping',
      data: [32, 12, 38, 8],
    },
  ],
  colors: [warning.main, info.dark],
};

export const dummyInquiryData = {
  labels: ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'],
  colors: ['#2065D1', '#00AB55', '#FF5630'],
  series: [
    {
      name: 'Today',
      data: [5, 8, 12, 10, 14, 18, 16, 11],
    },
    {
      name: 'This Week',
      data: [50, 42, 65, 70, 60, 55, 75, 68],
    },
    {
      name: 'This Month',
      data: [120, 130, 145, 150, 160, 170, 175, 180],
    },
  ],
};

export const dummyResolutionTimeData = {
  labels: ['Today', 'This Week', 'This Month'],
  colors: [warning.main],
  series: [
    {
      name: 'Resolution Time',
      data: [15, 18, 22],
    },
  ],
};

export const inquiryTypeData = {
  labels: ['Directions', 'Amenities', 'Complaints', 'Booking Issues', 'Others'],
  colors: [info.main, error.main, success.main, grey.main, secondary.dark],
  series: [
    {
      name: 'Inquiries',
      data: [45, 30, 20, 15, 40],
    },
  ],
};
