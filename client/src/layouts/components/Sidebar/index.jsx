import { useNavigate } from 'react-router-dom';

import { Button, Container, Typography } from '@mui/material';

import { LOGO_URL } from '../../../const';
import { blue, grey, red } from '@mui/material/colors';

import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';

import MetaMaskBtn from '../MetaMaskBtn';

import requestApi from '../../../utils/fetchAPI';
import Swal from 'sweetalert2';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await requestApi('auth/signout', 'POST');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      Swal.fire({
        icon: 'success',
        title: 'Logout success!'
      });
      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response.data.message
      });
    }
  };

  return (
    <Container
      sx={{
        minWidth: '240px',
        width: '240px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderWidth: '0px 1px 0px 0px',
        borderStyle: 'solid',
        borderColor: 'divider',
        margin: 0,
        padding: 0
      }}
    >
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: '20px',
          padding: 0,
          cursor: 'pointer'
        }}
      >
        <img src={LOGO_URL} alt="logo" width="100px" height="100px" />
      </Container>
      <MetaMaskBtn />
      <Container sx={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <Container
          sx={{
            width: '100%',
            color: grey[600],
            display: 'flex',
            gap: '10px',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            ':hover': { color: blue[600], bgcolor: grey[200] }
          }}
        >
          <DashboardIcon />
          <Typography sx={{ fontWeight: '500' }}>Dashboard</Typography>
        </Container>
        <Container
          sx={{
            width: '100%',
            color: grey[600],
            display: 'flex',
            borderRadius: '8px',
            gap: '10px',
            padding: '10px 20px',
            cursor: 'pointer',
            ':hover': { color: blue[600], bgcolor: grey[200] }
          }}
        >
          <GroupIcon />
          <Typography sx={{ fontWeight: '500' }}>Management</Typography>
        </Container>
        <Container
          sx={{
            width: '100%',
            color: grey[600],
            display: 'flex',
            borderRadius: '8px',
            gap: '10px',
            padding: '10px 20px',
            cursor: 'pointer',
            ':hover': { color: blue[600], bgcolor: grey[200] }
          }}
        >
          <InventoryIcon />
          <Typography sx={{ fontWeight: '500' }}>Orders</Typography>
        </Container>
      </Container>
      <Container>
        <Button
          onClick={handleLogout}
          variant="outlined"
          startIcon={<LogoutIcon />}
          sx={{
            borderColor: red[200],
            color: red[600],
            fontWeight: '500',
            width: '100%',
            padding: '8px 20px',
            my: '20px',
            ':hover': { color: red[800], borderColor: red[400] }
          }}
        >
          Logout
        </Button>
      </Container>
    </Container>
  );
}
