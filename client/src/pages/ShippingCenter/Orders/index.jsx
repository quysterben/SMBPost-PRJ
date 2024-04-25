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
  Button,
  Tooltip,
  Chip
} from '@mui/material';
import { grey } from '@mui/material/colors';

import Loader from '../../../components/Loader';
import AnimationButton from '../../../components/AnimationButton';
import UserDetailDiablog from '../../../components/UserDetailDiablog';

import requestAPI from '../../../utils/fetchAPI';

import { getAllOrders } from '../../../utils/web3func/orderFuncs';
import convertHistoryToStatus from '../../../utils/convertHistoryToStatus';

export default function CenterOrders() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const contract = useContractHook((state) => state.contract);
  const account = useContractHook((state) => state.account);

  const [orderDatas, setOrderDatas] = useState([]);

  //   DiablogHandle
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  const handleClickOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders(account, contract);
      const userDatasRes = await requestAPI('user', 'GET');
      const userDatas = userDatasRes.data.users;
      setOrderDatas(
        orders.map((param) => {
          const nowAtEmail = param.histories[param.histories.length - 1].posEmail;
          console.log(param);
          return {
            orderID: param.orderID,
            sender: userDatas.find((user) => user.email === param.senderEmail),
            receiver: userDatas.find((user) => user.email === param.receiverEmail),
            status: convertHistoryToStatus(param.histories[param.histories.length - 1]).text,
            statusColor: convertHistoryToStatus(param.histories[param.histories.length - 1]).color,
            note: param.note,
            nowAt: userDatas.find((user) => user.email === nowAtEmail)
          };
        })
      );
      setLoading(false);
    };

    if (!contract || !account) return;
    fetchOrders().then(() => console.log('Fetch orders done'));

    return () => {
      setOrderDatas([]);
    };
  }, [contract, account]);

  if (loading)
    return (
      <Container sx={{ position: 'fixed', top: '50%', left: '50%' }}>
        <Loader />
      </Container>
    );

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
        <AnimationButton navigateLink={'create'} />
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
          <TableBody>
            {orderDatas.map((order, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <Tooltip
                  title={order.orderID}
                  placement="bottom"
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [24, -32]
                          }
                        }
                      ]
                    }
                  }}
                >
                  <TableCell>{order.orderID.slice(0, 12)}</TableCell>
                </Tooltip>
                <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleClickOpen(order.sender)}>
                  {order.sender.username}
                </TableCell>
                <TableCell
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleClickOpen(order.receiver)}
                >
                  {order.receiver.username}
                </TableCell>
                <TableCell>
                  <Chip variant="filled" label={order.status} color={order.statusColor} />
                </TableCell>
                <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleClickOpen(order.nowAt)}>
                  {order.nowAt.username}
                </TableCell>
                <TableCell>{order.note}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => navigate(`${order.orderID}`)}
                    variant="contained"
                    color="primary"
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UserDetailDiablog open={open} onClose={handleClose} user={selectedUser} />
    </Container>
  );
}
