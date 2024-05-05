/* eslint-disable no-unused-vars */
import moment from 'moment';
import useContractHook from '../../../hooks/useContractHook';
import { useEffect, useState } from 'react';

import { getAllOrders, getOrdersByStaffEmail } from '../../../utils/web3func/orderFuncs';
import requestAPI from '../../../utils/fetchAPI';

import {
  Container,
  Paper,
  Table,
  TableContainer,
  TableHead,
  Typography,
  TableRow,
  TableCell
} from '@mui/material';
import { PieChart } from '@mui/x-charts';
import TotalCount from './components/TotalCount';
import { blue } from '@mui/material/colors';

export default function Overview() {
  const account = useContractHook((state) => state.account);
  const contract = useContractHook((state) => state.contract);

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

  //  fetchData
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await requestAPI('user', 'GET');
        res.data.users.forEach((param) => {
          if (param.role === 'shippingCenter' && param.isActive) {
            setCenters((prev) => prev + 1);
          } else if (param.role === 'storehouse' && param.isActive) {
            setStorehouses((prev) => prev + 1);
          } else if (param.role === 'customer' && param.isActive) {
            setCustomers((prev) => prev + 1);
          }
        });
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
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers().then(() => fetchAllOrders());
  }, []);

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
      <Container sx={{ mt: 5, display: 'flex', gap: '32px' }}>
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
        <Paper sx={{ p: '8px', flex: '1' }}>
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
                  <TableCell align="right">Requested</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Container>
  );
}
