/* eslint-disable no-unused-vars */
import moment from 'moment';
import useContractHook from '../../../hooks/useContractHook';
import { useEffect, useState } from 'react';

import {
  getAllOrders,
  getOrdersByCustomerEmail,
  getOrdersByStaffEmail,
  getAllOrdersIn5Days
} from '../../../utils/web3func/orderFuncs';
import requestAPI from '../../../utils/fetchAPI';

import {
  Container,
  Paper,
  Table,
  TableContainer,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { PieChart, SparkLineChart } from '@mui/x-charts';
import TotalCount from './components/TotalCount';
import { blue } from '@mui/material/colors';

import Loader from '../../../components/Loader';

export default function Overview() {
  const account = useContractHook((state) => state.account);
  const contract = useContractHook((state) => state.contract);

  const [loading, setLoading] = useState(true);

  // TotalCount
  const [centers, setCenters] = useState(0);
  const [storehouses, setStorehouses] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [orders, setOrders] = useState(0);
  const [successOrders, setSuccessOrders] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);

  //   Chart
  const [requestedOrders, setRequestedOrders] = useState([]);
  const [intransitOrders, setIntransitOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);

  //  Best Centers
  const [bestCenters, setBestCenters] = useState([]);
  const [bestCustomers, setBestCustomers] = useState([]);

  //  Orders in 5 days
  const [orderIn5Days, setOrderIn5Days] = useState();

  //  fetchData
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await requestAPI('user', 'GET');
        for await (const param of res.data.users) {
          if (param.role === 'shippingCenter' && param.isActive) {
            setCenters((prev) => prev + 1);
            const orderPerCenter = await getOrdersByStaffEmail(account, contract, param.email);
            setBestCenters((prev) => [
              ...prev,
              {
                name: param.username,
                address: param.address,
                total:
                  orderPerCenter.requestedRes.length +
                  orderPerCenter.intransitRes.length +
                  orderPerCenter.deliveredRes.length +
                  orderPerCenter.canceledRes.length,
                success:
                  (orderPerCenter.canceledRes.length /
                    (orderPerCenter.requestedRes.length +
                      orderPerCenter.intransitRes.length +
                      orderPerCenter.deliveredRes.length +
                      orderPerCenter.canceledRes.length)) *
                    100 || 0
              }
            ]);
          } else if (param.role === 'storehouse' && param.isActive) {
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
        setBestCenters((prev) => prev.sort((a, b) => b.total - a.total));
        setBestCenters((prev) => prev.sort((a, b) => b.success - a.success));
        setBestCustomers((prev) => prev.sort((a, b) => b.total - a.total));
        setBestCustomers((prev) => prev.sort((a, b) => b.success - a.success));
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAllOrders = async () => {
      try {
        const res = await getAllOrders(account, contract);
        setOrders(
          res.canceledRes.length +
            res.deliveredRes.length +
            res.intransitRes.length +
            res.requestedRes.length
        );
        setRequestedOrders(res.requestedRes);
        setIntransitOrders(res.intransitRes);
        setDeliveredOrders(res.deliveredRes);
        setCanceledOrders(res.canceledRes);
        setSuccessOrders(res.deliveredRes.length);

        res.requestedRes.forEach((param) => {
          if (param.status.text === 'Requested') {
            const isToday = moment(param.timestamp).isSame(new Date(), 'day');
            if (isToday) setTodayOrders((prev) => prev + 1);
          }
        });

        const orderIn5Days = await getAllOrdersIn5Days(account, contract);
        console.log(orderIn5Days);
        setOrderIn5Days(orderIn5Days);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers().then(() => fetchAllOrders().then(() => setLoading(false)));
  }, []);

  if (loading || account === '' || contract === '')
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
        centers={centers}
        storehouses={storehouses}
        customers={customers}
        orders={orders}
        successOrders={successOrders}
        todayOrders={todayOrders}
      />
      <Container sx={{ my: 5, display: 'flex', gap: '32px' }}>
        <Container>
          <Paper sx={{ p: '8px', flex: '1', mb: '24px' }}>
            <Typography variant="h6" sx={{ color: blue[600], mb: '4px' }}>
              Top Performers
            </Typography>
            <Typography variant="body1" fontWeight="100">
              Best Centers
            </Typography>
            <TableContainer>
              <Table sx={{ minWidth: 650, mt: '8px' }} aria-label="best centers">
                <TableHead>
                  <TableRow>
                    <TableCell>Center Name</TableCell>
                    <TableCell align="right">Address</TableCell>
                    <TableCell align="right">Success Rate</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bestCenters.splice(0, 5).map((row, index) => (
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
        </Container>
        <Container sx={{ width: '400px' }}>
          <Paper sx={{ width: '400px', p: '8px', mb: '24px' }}>
            <Typography variant="h6" align="center" sx={{ mb: '12px', color: blue[600] }}>
              Order Status
            </Typography>
            <PieChart
              colors={['#FFC107', '#2196F3', '#4CAF50', '#F44336']}
              series={[
                {
                  data: [
                    { id: 0, value: requestedOrders.length, label: 'Requested' },
                    { id: 1, value: intransitOrders.length, label: 'In transit' },
                    { id: 2, value: deliveredOrders.length, label: 'Delivered' },
                    { id: 3, value: canceledOrders.length, label: 'Cancelled' }
                  ]
                }
              ]}
              width={400}
              height={200}
            />
          </Paper>
          <Paper sx={{ width: '400px', p: '8px' }}>
            <Typography variant="h6" align="center" sx={{ mb: '12px', color: blue[600] }}>
              Order In 5 Days
            </Typography>
            <SparkLineChart
              showHighlight={true}
              showTooltip={true}
              data={[
                orderIn5Days.FiveDayAgoOrders.length,
                orderIn5Days.FourDayAgoOrders.length,
                orderIn5Days.ThreeDayAgoOrders.length,
                orderIn5Days.TwoDayAgoOrders.length,
                orderIn5Days.OneDayAgoOrders.length,
                orderIn5Days.TodayOrders.length
              ]}
              height={100}
            />
          </Paper>
        </Container>
      </Container>
    </Container>
  );
}
