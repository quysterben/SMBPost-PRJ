import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { Fragment, useEffect } from 'react';

import DefaultLayout from './layouts/DefaultLayout';

import PrivateRouter from './routes/privateRouter';
import AdminRouter from './routes/adminRouter';
import ShippingRouter from './routes/shippingRouter';
import StoreHouseRouter from './routes/storeHouseRouter';
import CustomerRouter from './routes/customerRouter';

import useContractHook from './hooks/useContractHook';

import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import contractInfo from './utils/contract-info.json';

function App() {
  const web3 = useContractHook((state) => state.web3);
  const setContract = useContractHook((state) => state.setContract);
  const setAccount = useContractHook((state) => state.setAccount);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const contract = new web3.eth.Contract(
          contractInfo.contractABI,
          contractInfo.contractAddress
        );
        if (provider) {
          provider.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          const data = {
            contract,
            provider,
            web3
          };

          setContract(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    if (web3) {
      getAccount();
    }
  }, [web3]);

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
