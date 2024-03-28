import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Avatar, Container, IconButton, Typography, Chip } from '@mui/material';
import { blue } from '@mui/material/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Swal from 'sweetalert2';

import requestApi from '../../../utils/fetchAPI';
import convertRoleToText from '../../../utils/convertRoleToText';

import useContractHook from '../../../hooks/useContractHook';

import {
  createShipping,
  createStorehouse,
  removeShippingCenter,
  removeStorehouse
} from '../../../utils/web3func/userFuncs';
import { LoadingButton } from '@mui/lab';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const contract = useContractHook((state) => state.contract);
  const address = useContractHook((state) => state.account);

  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  const fetchData = async () => {
    try {
      const res = await requestApi(`user/get-user/${id}`, 'GET');
      setUserData(res.data.user);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActiveAccount = async () => {
    if (!address) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please connect your wallet first!'
      });
      return;
    }

    try {
      setIsLoadingBtn(true);

      if (userData.role === 'shippingCenter') {
        await createShipping(address, contract, {
          email: userData.email
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Active account successfully!'
        });
      } else {
        await createStorehouse(address, contract, {
          email: userData.email
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Active account successfully!'
        });
      }
      const res = await requestApi(`user/active/${id}`, 'PUT');
      console.log(res);
      fetchData();
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      });
    }
    setIsLoadingBtn(false);
  };

  const handleDeactiveAccount = async () => {
    if (!address) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please connect your wallet first!'
      });
      return;
    }

    try {
      setIsLoadingBtn(true);
      if (userData.role === 'shippingCenter') {
        await removeShippingCenter(address, contract, userData.email);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Deactive account successfully!'
        });
      } else {
        await removeStorehouse(address, contract, userData.email);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Deactive account successfully!'
        });
      }
      const res = await requestApi(`user/active/${id}`, 'PUT');
      console.log(res);
      fetchData();
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      });
    }
    setIsLoadingBtn(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
      <Container sx={{ display: 'flex', mt: '32px', gap: '32px' }}>
        <Container
          sx={{
            width: '40%',
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            alignItems: 'center',
            gap: '24px',
            borderRight: '1px solid #ccc',
            paddingY: '48px'
          }}
        >
          <Avatar sx={{ width: '120px', height: '120px', bgcolor: blue[500] }}>
            {userData.username.slice(0, 1)}
          </Avatar>
          <Typography variant="h6">{userData.username}</Typography>
          <Chip label={convertRoleToText(userData.role)} color="success" variant="outlined" />
        </Container>
        <Container
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <Typography variant="h8" sx={{ fontWeight: 'bold' }}>
            Email:{' '}
            <p style={{ fontSize: '16px', display: 'inline-block', fontWeight: 'normal' }}>
              {' '}
              {userData.email}{' '}
            </p>
          </Typography>
          <Typography variant="h8" sx={{ fontWeight: 'bold' }}>
            ID:{' '}
            <p style={{ fontSize: '16px', display: 'inline-block', fontWeight: 'normal' }}>
              {' '}
              {userData._id}{' '}
            </p>
          </Typography>
          <Typography variant="h8" sx={{ fontWeight: 'bold' }}>
            Phone:{' '}
            <p style={{ fontSize: '16px', display: 'inline-block', fontWeight: 'normal' }}>
              {' '}
              {userData.phonenumber}{' '}
            </p>
          </Typography>
          <Typography variant="h8" sx={{ fontWeight: 'bold' }}>
            Address:{' '}
            <p style={{ fontSize: '16px', display: 'inline-block', fontWeight: 'normal' }}>
              {' '}
              {userData.address}{' '}
            </p>
          </Typography>
          <Container
            sx={{ display: 'flex', mt: '36px', justifyContent: 'center', alignItems: 'center' }}
          >
            {!userData.isActive ? (
              <LoadingButton
                loading={isLoadingBtn}
                onClick={handleActiveAccount}
                variant="contained"
                color="success"
              >
                Active Account
              </LoadingButton>
            ) : (
              <LoadingButton
                onClick={handleDeactiveAccount}
                loading={isLoadingBtn}
                variant="outlined"
                color="error"
              >
                Deactivate account
              </LoadingButton>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
