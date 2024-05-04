/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import useContractHook from '../../../hooks/useContractHook';

import { getOrderById } from '../../../utils/web3func/orderFuncs';
import convertHistoryToStatus from '../../../utils/convertHistoryToStatus';
import { transferToStorehouse } from '../../../utils/web3func/transferFuncs';
import requestApi from '../../../utils/fetchAPI';

import Swal from 'sweetalert2';
import QRCode from 'react-qr-code';
import {
  Container,
  Paper,
  Typography,
  IconButton,
  Chip,
  Step,
  Stepper,
  StepLabel,
  Backdrop,
  Box,
  Button
} from '@mui/material';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { grey } from '@mui/material/colors';
import TransferButton from '../../../components/TransferButton';
import UserDetailDiablog from '../../../components/UserDetailDiablog';
import CancelOrderModal from '../../../components/ModalComponents/CancelOrderModal';
import Loader from '../../../components/Loader';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);

  const contract = useContractHook((state) => state.contract);
  const account = useContractHook((state) => state.account);

  const [orderData, setOrderData] = useState({});
  const [userDatas, setUserDatas] = useState([]);
  const [historyDatas, setHistoryDatas] = useState([]);
  const [senderData, setSenderData] = useState({});
  const [receiverData, setReceiverData] = useState({});
  const [centerData, setCenterData] = useState({});
  const [trackerDatas, setTrackerDatas] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const order = await getOrderById(account, contract, id);
        setOrderData(order);
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
        const sender = userDatasRes.data.users.find((user) => user.email === order[0]);
        const receiver = userDatasRes.data.users.find((user) => user.email === order[1]);
        const center = userDatasRes.data.users.find((user) => user.email === order[4][0]);
        setSenderData(sender);
        setReceiverData(receiver);
        setCenterData(center);
        setHistoryDatas(order[5]);
        setTrackerDatas([order[0], ...order[4], order[1]]);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserDatas();
  }, [id]);

  const moveToStorehouse = async () => {
    try {
      setIsLoadingTransfer(true);
      const storehouseEmail = trackerDatas[1 + historyDatas.length];
      await transferToStorehouse(account, contract, {
        orderID: id,
        storehouseEmail
      });
      navigate(-1);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'User denied transaction!'
      });
    }
    setIsLoadingTransfer(false);
  };

  //   userDetailDialog
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  const handleClickOpen = (userEmail) => {
    const user = userDatas.find((param) => param.email === userEmail);
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading)
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
      {isLoadingTransfer && (
        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'transparent' }}
          open={true}
        >
          <Loader />
        </Backdrop>
      )}
      <Paper
        elevation={3}
        sx={{
          opacity: isLoadingTransfer ? 0.5 : 1,
          my: '4px',
          py: '20px',
          minHeight: '680px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          bgcolor: 'white'
        }}
      >
        <Container
          sx={{
            display: 'flex',
            width: 'full',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Order Tracking</Typography>
          {convertHistoryToStatus(orderData[5][orderData[5].length - 1]).text === 'Requested' ? (
            <Box
              sx={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}
            >
              <TransferButton onClickAction={() => moveToStorehouse()} />
              <CancelOrderModal orderID={id} />
            </Box>
          ) : convertHistoryToStatus(orderData[5][orderData[5].length - 1]).text === 'Delivered' ? (
            <Box sx={{ w: 0 }} />
          ) : convertHistoryToStatus(orderData[5][orderData[5].length - 1]).text === 'Cancelled' ? (
            <Box sx={{ w: 0 }} />
          ) : (
            <CancelOrderModal orderID={id} />
          )}
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
        <Container sx={{ mt: '60px' }}>
          <Stepper variant="progress" activeStep={historyDatas.length + 1} alternativeLabel>
            {trackerDatas.map((label, index) => {
              let stepContent = '';
              let stepDate = '';
              if (index === 0) stepContent = 'Prepare for request';
              else if (historyDatas[index - 1]) {
                stepContent = historyDatas[index - 1].action;
                stepDate = historyDatas[index - 1].date;
              }
              return (
                <Step sx={{ cursor: 'pointer' }} onClick={() => handleClickOpen(label)} key={index}>
                  <StepLabel error={stepContent === 'Canceled'}>
                    <Typography>
                      {userDatas.find((param) => param.email === label).username}
                    </Typography>
                    <Typography sx={{ display: 'block' }} variant="caption" color="textSecondary">
                      {stepContent}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {stepDate}
                    </Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Container>
      </Paper>
      <UserDetailDiablog open={open} onClose={handleClose} user={selectedUser} />
    </Container>
  );
}
