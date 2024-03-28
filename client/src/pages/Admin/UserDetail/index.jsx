import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Avatar, Container, IconButton, Typography, Chip, Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Swal from 'sweetalert2';

import requestApi from '../../../utils/fetchAPI';
import convertRoleToText from '../../../utils/convertRoleToText';

import useContractHook from '../../../hooks/useContractHook';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  //   const web3 = useContractHook((state) => state.web3);
  //   const contract = useContractHook((state) => state.contract);
  const address = useContractHook((state) => state.account);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await requestApi(`user/get-user/${id}`, 'GET');
        setUserData(res.data.user);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

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
              <Button onClick={handleActiveAccount} variant="contained" color="success">
                Active Account
              </Button>
            ) : (
              <Button variant="outlined" color="error">
                Deactivate account
              </Button>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
