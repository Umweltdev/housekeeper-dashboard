import axios from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API, timeout: 5000 });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config = {}] = Array.isArray(args) ? args : [args];
  const method = (config.method || 'GET').toUpperCase();
  console.log('Fetcher request:', { url, method, data: config.data }); // Debug log

  try {
    const res = await axiosInstance({
      url,
      method,
      data: config.data,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Fetcher error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/blog',
    details: '/api/blog',
    latest: '/api/blog/latest',
    search: '/api/blog/search',
  },
  product: {
    list: '/api/complaints',
    details: '/api/complaints',
    search: '/api/complaints',
  },
  room: {
    list: '/api/room/allRooms',
    details: '/api/room-type',
    roomType: '/api/room/roomType',
    updateRoom: '/api/room',
  },
  roomType: {
    list: '/api/room-type',
    details: '/api/room-type',
  },
  user: {
    list: '/api/user',
    details: '/api/user',
  },
  event: {
    list: '/api/event',
    details: '/api/event',
  },
  booking: {
    list: '/api/booking',
    details: '/api/booking',
  },
  floor: {
    list: '/api/floor',
    details: '/api/floor',
  },
  invoice: {
    list: '/api/invoice',
    details: '/api/invoice',
  },
  task: {
    list: '/api/task',
    details: '/api/task',
  },
  inventory: {
    list: '/api/inventory',
    details: '/api/inventory',
    create: '/api/inventory',
    delete: '/api/inventory',
  },
};
