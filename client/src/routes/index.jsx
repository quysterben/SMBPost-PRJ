import NotFound from '../pages/NotFound';
import Dashboard from '../pages/Dashboard';

import DefaultLayout from '../layouts/DefaultLayout';

const publicRoutes = [
  { path: '/dashboard', component: Dashboard, layout: DefaultLayout },
  { path: '*', component: NotFound, layout: null }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
