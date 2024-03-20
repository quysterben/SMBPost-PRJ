import NotFound from '../pages/Common/NotFound';
import Login from '../pages/Common/Login';

import DefaultLayout from '../layouts/DefaultLayout';

import Management from '../pages/Admin/Management';

const publicRoutes = [{ path: '/login', component: Login, layout: null }];

const privateRoutes = [
  { path: '/admin/dashboard', component: Management, layout: DefaultLayout, role: 'admin' },
  { path: '*', component: NotFound, layout: null }
];

export { publicRoutes, privateRoutes };
