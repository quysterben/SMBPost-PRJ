import NotFound from '../pages/NotFound';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';

import DefaultLayout from '../layouts/DefaultLayout';

const publicRoutes = [
  { path: '/dashboard', component: Dashboard, layout: DefaultLayout },
  { path: '/login', component: Login, layout: null },
  { path: '*', component: NotFound, layout: null }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
