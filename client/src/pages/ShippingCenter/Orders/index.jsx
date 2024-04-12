/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useContractHook from '../../../hooks/useContractHook';

import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button
} from '@mui/material';
import { grey } from '@mui/material/colors';

import { getAllOrders } from '../../../utils/web3func/orderFuncs';

export default function CenterOrders() {
  const navigate = useNavigate();

  const contract = useContractHook((state) => state.contract);
  const account = useContractHook((state) => state.account);

  const [orderDatas, setOrderDatas] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders(account, contract);
      console.log(orders);
      setOrderDatas(orders);
    };

    fetchOrders().then(() => console.log('Fetch orders done'));
  }, []);

  return (
    <Container sx={{ bgcolor: grey[100], flex: 1, height: '100vh', margin: 0, padding: 0 }}>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          height: '48px'
        }}
      >
        <Button onClick={() => navigate('create')} variant="contained">
          Create new order
        </Button>
      </Container>
      <TableContainer sx={{ width: '96%', mx: 'auto', mt: '12px' }} component={Paper}>
        <Table aria-label="User management">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sender</TableCell>
              <TableCell>Receiver</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Now At</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
