import NotFound from '../pages/Common/NotFound';
import Login from '../pages/Common/Login';

import DefaultLayout from '../layouts/DefaultLayout';

import Management from '../pages/Admin/Management';
import UserDetail from '../pages/Admin/UserDetail';
import Overview from '../pages/Admin/Overview';

import CenterOverview from '../pages/ShippingCenter/Overview';
import CenterOrders from '../pages/ShippingCenter/Orders';
import CreateOrder from '../pages/ShippingCenter/CreateOrder';

import Verify from '../pages/Common/Verify';

const publicRoutes = [{ path: '/login', component: Login, layout: null }];

const privateRoutes = [
  //   adminRoutes
  { path: '/admin/management', component: Management, layout: DefaultLayout, role: 'admin' },
  {
    path: '/admin/management/:id',
    component: UserDetail,
    layout: DefaultLayout,
    role: 'admin'
  },
  { path: '/admin/overview', component: Overview, layout: DefaultLayout, role: 'admin' },

  //   centerRoutes
  {
    path: '/center/overview',
    component: CenterOverview,
    layout: DefaultLayout,
    role: 'shippingCenter'
  },
  {
    path: '/center/orders',
    component: CenterOrders,
    layout: DefaultLayout,
    role: 'shippingCenter'
  },
  {
    path: '/center/orders/create',
    component: CreateOrder,
    layout: DefaultLayout,
    role: 'shippingCenter'
  },

  { path: '*', component: NotFound, layout: DefaultLayout },
  { path: '/verify', component: Verify, layout: DefaultLayout }
];

export { publicRoutes, privateRoutes };
