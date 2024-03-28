import NotFound from '../pages/Common/NotFound';
import Login from '../pages/Common/Login';

import DefaultLayout from '../layouts/DefaultLayout';

import Management from '../pages/Admin/Management';
import UserDetail from '../pages/Admin/UserDetail';

const publicRoutes = [{ path: '/login', component: Login, layout: null }];

const privateRoutes = [
  { path: '/admin/management', component: Management, layout: DefaultLayout, role: 'admin' },
  {
    path: '/admin/management/:id',
    component: UserDetail,
    layout: DefaultLayout,
    role: 'admin'
  },
  { path: '*', component: NotFound, layout: null }
];

export { publicRoutes, privateRoutes };
