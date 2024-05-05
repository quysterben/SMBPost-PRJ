/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import useContractHook from '../../../hooks/useContractHook';

import moment from 'moment';
import {
  getOrdersByStaffEmail,
  getOrdersByCustomerEmail
} from '../../../utils/web3func/orderFuncs';
import requestApi from '../../../utils/fetchAPI';

import {
  Container,
  Paper,
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { blue } from '@mui/material/colors';
import TotalCount from './components/TotalCount';
import Loader from '../../../components/Loader';

export default function CenterOverview() {
  const currUserEmail = localStorage.getItem('userEmail');
  const account = useContractHook((state) => state.account);
  const contract = useContractHook((state) => state.contract);

  const [loading, setLoading] = useState(true);

  //   Total
  const [customers, setCustomers] = useState(0);
  const [orders, setOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [storehouses, setStorehouses] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [intransitOrders, setIntransitOrders] = useState(0);

  const [requestedOrders, setRequestedOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);

  const [bestCustomers, setBestCustomers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await requestApi('user', 'GET');
        for await (const param of res.data.users) {
          if (param.role === 'storehouse' && param.isActive) {
            setStorehouses((prev) => prev + 1);
          } else if (param.role === 'customer' && param.isActive) {
            setCustomers((prev) => prev + 1);
            const orderPerCustomer = await getOrdersByCustomerEmail(account, contract, param.email);
            setBestCustomers((prev) => [
              ...prev,
              {
                name: param.username,
                address: param.address,
                total:
                  orderPerCustomer.requestedRes.length +
                  orderPerCustomer.intransitRes.length +
                  orderPerCustomer.deliveredRes.length +
                  orderPerCustomer.canceledRes.length,
                success:
                  (orderPerCustomer.canceledRes.length /
                    (orderPerCustomer.requestedRes.length +
                      orderPerCustomer.intransitRes.length +
                      orderPerCustomer.deliveredRes.length +
                      orderPerCustomer.canceledRes.length)) *
                    100 || 0
              }
            ]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await getOrdersByStaffEmail(account, contract, currUserEmail);
        setOrders(
          res.canceledRes.length +
            res.deliveredRes.length +
            res.intransitRes.length +
            res.requestedRes.length
        );
        setIntransitOrders(res.intransitRes.length);
        setDeliveredOrders(res.deliveredRes.length);
        setCanceledOrders(res.canceledRes.length);
        setRequestedOrders(res.requestedRes);

        res.requestedRes.forEach((param) => {
          if (param.status.text === 'Requested') {
            const isToday = moment(param.timestamp).isSame(new Date(), 'day');
            if (isToday) setTodayOrders((prev) => prev + 1);
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers().then(() => fetchOrders().then(() => setLoading(false)));
  }, []);

  if (loading)
    return (
      <Container
        sx={{
          height: '92vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Loader />
      </Container>
    );

  return (
    <Container>
      <TotalCount
        orders={orders}
        successOrders={deliveredOrders}
        intransitOrders={intransitOrders}
        todayOrders={todayOrders}
        storehouses={storehouses}
        customers={customers}
      />
      <Container sx={{ my: 5, display: 'flex', gap: '32px' }}>
        <Paper sx={{ p: '8px', flex: '1' }}>
          <Typography variant="h6" sx={{ color: blue[600], mb: '4px' }}>
            Top Customers
          </Typography>
          <Typography variant="body1" fontWeight="100">
            Best customers
          </Typography>
          <TableContainer>
            <Table sx={{ minWidth: 650, mt: '8px' }} aria-label="best centers">
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell align="right">Address</TableCell>
                  <TableCell align="right">Success Rate</TableCell>
                  <TableCell align="right">Total Orders</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bestCustomers.splice(0, 5).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.address}</TableCell>
                    <TableCell align="right">{Math.round(row.success)}%</TableCell>
                    <TableCell align="right">{row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Container sx={{ width: '400px' }}>
          <Paper sx={{ width: '400px', p: '8px' }}>
            <Typography variant="h6" align="center" sx={{ mb: '12px', color: blue[600] }}>
              Order Status
            </Typography>
            <PieChart
              colors={['#FFC107', '#2196F3', '#4CAF50', '#F44336']}
              series={[
                {
                  data: [
                    { id: 0, value: requestedOrders.length, label: 'Requested' },
                    { id: 1, value: intransitOrders, label: 'In transit' },
                    { id: 2, value: deliveredOrders, label: 'Delivered' },
                    { id: 3, value: canceledOrders, label: 'Cancelled' }
                  ]
                }
              ]}
              width={400}
              height={200}
            />
          </Paper>
        </Container>
      </Container>
    </Container>
  );
}
