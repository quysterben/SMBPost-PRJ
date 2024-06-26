import NotFound from '../pages/Common/NotFound';
import LoginPage from '../pages/Common/Login';

import DefaultLayout from '../layouts/DefaultLayout';

import Management from '../pages/Admin/Management';
import UserDetail from '../pages/Admin/UserDetail';
import Overview from '../pages/Admin/Overview';
import AdminOrders from '../pages/Admin/Orders';

import CenterOverview from '../pages/ShippingCenter/Overview';
import CenterOrders from '../pages/ShippingCenter/Orders';
import CreateOrder from '../pages/ShippingCenter/CreateOrder';
import OrderDetail from '../pages/ShippingCenter/OrderDetail';

import StorehouseOrders from '../pages/Storehouse/Orders';
import StorehouseOrderDetail from '../pages/Storehouse/OrderDetail';

import Verify from '../pages/Common/Verify';
import VerifyByID from '../pages/Common/Verify/VerifyByID';
import VerifyByQrCode from '../pages/Common/Verify/VerifyByQrCode';
import VerifyOrderDetail from '../pages/Common/OrderDetail';
import CustomerOrders from '../pages/Customer/Orders';

const publicRoutes = [{ path: '/login', component: LoginPage, layout: null }];

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
  { path: '/admin/orders', component: AdminOrders, layout: DefaultLayout, role: 'admin' },

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
  {
    path: '/center/orders/:id',
    component: OrderDetail,
    layout: DefaultLayout,
    role: 'shippingCenter'
  },

  //   storehouseRoutes
  {
    path: '/storehouse/orders',
    component: StorehouseOrders,
    layout: DefaultLayout,
    role: 'storehouse'
  },
  {
    path: '/storehouse/orders/:id',
    component: StorehouseOrderDetail,
    layout: DefaultLayout,
    role: 'storehouse'
  },

  //  customerRoutes
  { path: '/customer/orders', component: CustomerOrders, layout: DefaultLayout, role: 'customer' },

  { path: '*', component: NotFound, layout: DefaultLayout },
  { path: '/verify', component: Verify, layout: DefaultLayout },
  { path: '/verify/by-id', component: VerifyByID, layout: DefaultLayout },
  { path: '/verify/by-qr-code', component: VerifyByQrCode, layout: DefaultLayout },
  { path: '/verify/order/:id', component: VerifyOrderDetail, layout: DefaultLayout }
];

export { publicRoutes, privateRoutes };
