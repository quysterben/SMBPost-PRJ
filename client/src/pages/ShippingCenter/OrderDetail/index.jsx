/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import useContractHook from '../../../hooks/useContractHook';

import { getOrderById } from '../../../utils/web3func/orderFuncs';
import convertHistoryToStatus from '../../../utils/convertHistoryToStatus';
import requestApi from '../../../utils/fetchAPI';

import QRCode from 'react-qr-code';
import { Container, Paper, Typography, IconButton, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { grey } from '@mui/material/colors';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const contract = useContractHook((state) => state.contract);
  const account = useContractHook((state) => state.account);

  const [orderData, setOrderData] = useState({});
  // User Data: center, sender, receiver
  const [userDatas, setUserDatas] = useState([]); // [center, sender, receiver]
  const [senderData, setSenderData] = useState({});
  const [receiverData, setReceiverData] = useState({});
  const [centerData, setCenterData] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await getOrderById(account, contract, id);
        setOrderData(order);
        console.log(order);
        return order;
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUserDatas = async () => {
      try {
        const order = await fetchOrder();
        const userDatasRes = await requestApi('user', 'GET');
        setUserDatas(userDatasRes.data.users);
        setSenderData(userDatasRes.data.users.find((user) => user.email === order[0]));
        setReceiverData(userDatasRes.data.users.find((user) => user.email === order[1]));
        setCenterData(userDatasRes.data.users.find((user) => user.email === order[4][0]));
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserDatas();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  return (
    <Container>
      <Paper
        elevation={3}
        sx={{
          my: '4px',
          py: '20px',
          minHeight: '680px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          bgcolor: 'white'
        }}
      >
        <Container sx={{ display: 'flex', width: 'full', justifyContent: 'space-between' }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Order Tracking</Typography>
          <IconButton onClick={() => navigate(-1)}>
            <LocalShippingOutlinedIcon />
          </IconButton>
        </Container>
        <Container
          sx={{ px: '80px', borderTopWidth: '1px', borderStyle: 'solid', borderColor: grey[100] }}
        ></Container>
        <Container
          sx={{
            px: '80px',
            mt: '12px',
            display: 'flex',
            gap: '12px'
          }}
        >
          <Container
            sx={{
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              py: '8px',
              borderWidth: '1px',
              borderStyle: 'dotted',
              borderColor: grey[300],
              borderRadius: '8px'
            }}
          >
            <Typography variant="h7">
              <b>ID:</b> {id}
            </Typography>
            <Typography variant="h7">
              <b>Description:</b> {orderData[3]}
            </Typography>
            <Typography variant="h7">
              <b>Requested Time: </b>
              {orderData[5][0][1]}
            </Typography>
            <Typography variant="h7">
              <b>Status: </b>
              <Chip
                variant="outlined"
                label={convertHistoryToStatus(orderData[5][orderData[5].length - 1]).text}
                color={convertHistoryToStatus(orderData[5][orderData[5].length - 1]).color}
              />
            </Typography>
            <Typography variant="h7">
              <b>ImageURL: </b>
              <Link style={{ color: 'blue' }} to={orderData[2]} target="_blank">
                View Image
              </Link>
            </Typography>
          </Container>
          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <QRCode value={id} size={180} />
          </Container>
        </Container>
        <Container sx={{ px: '80px', display: 'flex', gap: '12px' }}>
          <Container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              borderWidth: '1px',
              borderStyle: 'dotted',
              borderColor: grey[300],
              borderRadius: '8px',
              py: '8px'
            }}
          >
            <Typography variant="h7" fontWeight="bold">
              From:
            </Typography>
            <Typography>
              {senderData.username} - {senderData.phonenumber}
            </Typography>
            <Typography>{senderData.email}</Typography>
            <Typography>{senderData.address}</Typography>
          </Container>
          <Container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              borderWidth: '1px',
              borderStyle: 'dotted',
              borderColor: grey[300],
              borderRadius: '8px',
              py: '8px'
            }}
          >
            <Typography variant="h7" fontWeight="bold">
              To:
            </Typography>
            <Typography>
              {receiverData.username} - {receiverData.phonenumber}
            </Typography>
            <Typography>{receiverData.email}</Typography>
            <Typography>{receiverData.address}</Typography>
          </Container>
          <Container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              borderWidth: '1px',
              borderStyle: 'dotted',

              borderColor: grey[300],
              borderRadius: '8px',
              py: '8px'
            }}
          >
            <Typography variant="h7" fontWeight="bold">
              Center:
            </Typography>
            <Typography>
              {centerData.username} - {centerData.phonenumber}
            </Typography>
            <Typography>{centerData.email}</Typography>
            <Typography>{centerData.address}</Typography>
          </Container>
        </Container>
      </Paper>
    </Container>
  );
}
