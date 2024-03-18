import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { Fragment } from 'react';

import DefaultLayout from './layouts/DefaultLayout';

import PrivateRouter from './routes/privateRouter';
import AdminRouter from './routes/adminRouter';
import ShippingRouter from './routes/shippingRouter';
import StoreHouseRouter from './routes/storeHouseRouter';
import CustomerRouter from './routes/customerRouter';

function App() {
  return (
    <Router>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = DefaultLayout;

          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
        {privateRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = DefaultLayout;

          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }

          let AdditionalRouter = Fragment;
          if (route.role === 'admin') {
            AdditionalRouter = AdminRouter;
          }
          if (route.role === 'shippingCenter') {
            AdditionalRouter = ShippingRouter;
          }
          if (route.role === 'storeHouse') {
            AdditionalRouter = StoreHouseRouter;
          }
          if (route.role === 'customer') {
            AdditionalRouter = CustomerRouter;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <PrivateRouter>
                  <AdditionalRouter>
                    <Layout>
                      <Page />
                    </Layout>
                  </AdditionalRouter>
                </PrivateRouter>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
