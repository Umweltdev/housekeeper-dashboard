
import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  event: {
    root: `/event`,
    checkout: `/event/checkout`,
    details: (id) => `/event/${id}`,
    demo: {
      details: `/event/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (id) => `/post/${paramCase(id)}`,
    demo: {
      details: (id) => `/post/${paramCase(id)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
    supabase: {
      login: `${ROOTS.AUTH}/supabase/login`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      register: `${ROOTS.AUTH}/supabase/register`,
      newPassword: `${ROOTS.AUTH}/supabase/new-password`,
      forgotPassword: `${ROOTS.AUTH}/supabase/forgot-password`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/task/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/user/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/user/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/inventory`,
      details: (id) => `${ROOTS.DASHBOARD}/inventory/${id}`,

      demo: {
        details: `${ROOTS.DASHBOARD}/inventory/${MOCK_ID}`,
      },
    },
    task: {
      root: `${ROOTS.DASHBOARD}/task`,
      new: `${ROOTS.DASHBOARD}/task/new`,
      list: `${ROOTS.DASHBOARD}/task/list`,
      cards: `${ROOTS.DASHBOARD}/task/cards`,
      profile: `${ROOTS.DASHBOARD}/task/profile`,
      account: `${ROOTS.DASHBOARD}/task/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/task/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/task/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/task/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/task/${MOCK_ID}/edit`,
      },
    },
    inventory: {
      root: `${ROOTS.DASHBOARD}/inventory`,
      new: `${ROOTS.DASHBOARD}/inventory/new`,
    },
    training: {
      root: `${ROOTS.DASHBOARD}/training`,
      // new: `${ROOTS.DASHBOARD}/inventory/new`,
    },
    schedule: {
      root: `${ROOTS.DASHBOARD}/schedule`,
      // new: `${ROOTS.DASHBOARD}/inventory/new`,
    },

    booking: {
      root: `${ROOTS.DASHBOARD}/booking`,
      new: `${ROOTS.DASHBOARD}/booking/new`,
      list: `${ROOTS.DASHBOARD}/booking/list`,
      cards: `${ROOTS.DASHBOARD}/booking/cards`,
      profile: `${ROOTS.DASHBOARD}/booking/profile`,
      account: `${ROOTS.DASHBOARD}/booking/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/booking/${id}/edit`,
      details: (id) => `${ROOTS.DASHBOARD}/booking/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/booking/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/booking/${MOCK_ID}/edit`,
      },
    },
    event: {
      root: `${ROOTS.DASHBOARD}/event`,
      new: `${ROOTS.DASHBOARD}/event/new`,
      details: (id) => `${ROOTS.DASHBOARD}/event/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/event/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (id) => `${ROOTS.DASHBOARD}/post/${paramCase(id)}`,
      edit: (id) => `${ROOTS.DASHBOARD}/post/${paramCase(id)}/edit`,
      demo: {
        details: (id) => `${ROOTS.DASHBOARD}/post/${paramCase(id)}`,
        edit: (id) => `${ROOTS.DASHBOARD}/post/${paramCase(id)}/edit`,
      },
    },

    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    room: {
      root: `${ROOTS.DASHBOARD}/room`,
      new: `${ROOTS.DASHBOARD}/room/new`,
      details: (id) => `${ROOTS.DASHBOARD}/room/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/room/${id}/edit`,
      roomedit: (id) => `${ROOTS.DASHBOARD}/room/${id}/edit`,
      demo: {
        details: (id) => `${ROOTS.DASHBOARD}/room/${id}`,
        edit: (id) => `${ROOTS.DASHBOARD}/room/${id}/edit`,
      },
    },

    roomType: {
      root: `${ROOTS.DASHBOARD}/room-type`,
      new: `${ROOTS.DASHBOARD}/room-type/new`,
      details: (id) => `${ROOTS.DASHBOARD}/room/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/room-type/${id}/edit`,
      // demo: {
      //   details: (id) => `${ROOTS.DASHBOARD}/room-type/${id}`,
      //   edit: (id) => `${ROOTS.DASHBOARD}/room-type/${id}/edit`,
      // },
    },
  },
};
