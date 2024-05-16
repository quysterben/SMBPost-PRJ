import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import requestAPI from '../../../utils/fetchAPI';
import Swal from 'sweetalert2';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { blue } from '@mui/material/colors';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LOGO_URL, AUTH_IMG_URL } from '../../../const';

export default function LoginPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/');
    }
  }, []);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (emailInput.current.value === '' || passwordInput.current.value === '') {
      Swal.fire({
        icon: 'error',
        text: 'Please fill in all fields!'
      });
      return;
    }
    try {
      setIsLoading(true);
      const res = await requestAPI('auth/signin', 'POST', {
        email: emailInput.current.value,
        password: passwordInput.current.value
      });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('userRole', res.data.role);
      localStorage.setItem('userName', res.data.username);
      localStorage.setItem('userEmail', res.data.email);
      if (res.data.role !== 'admin') {
        localStorage.setItem('userAddress', res.data.address);
        localStorage.setItem('userPhone', res.data.phone);
      }
      Swal.fire({
        icon: 'success',
        title: 'Login success!'
      });
      if (res.data.role === 'admin') {
        navigate('/admin/overview');
      } else if (res.data.role === 'shippingCenter') {
        navigate('/center/overview');
      } else if (res.data.role === 'storehouse') {
        navigate('/storehouse/orders');
      } else if (res.data.role === 'customer') {
        navigate('/verify');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response.data.message || "Email or password isn't correct!"
      });
    }

    setIsLoading(false);
  };

  return (
    <Container sx={{ height: '100vh', display: 'flex', m: 0, p: 0 }}>
      <Container sx={{ bgcolor: blue[50], display: 'flex', flexDirection: 'column', m: 0, p: 0 }}>
        <Container sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={LOGO_URL} width="100" height="100" />
          <Typography variant="h5" fontWeight="bold">
            SMBPost
          </Typography>
        </Container>
        <Container
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1' }}
        >
          <img src={AUTH_IMG_URL} width="600" height="600" />
        </Container>
      </Container>
      <Container
        sx={{
          height: '100vh',
          width: '40%',
          display: 'flex',
          padding: '100px',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '32px'
        }}
      >
        <Container sx={{ p: 0 }}>
          <Typography variant="h5" fontWeight="bold">
            Welcome to SMBPost
          </Typography>
          <Typography variant="h8">Please login to the system!</Typography>
        </Container>
        <form
          onSubmit={handleSubmitLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '28px'
          }}
        >
          <FormControl sx={{ width: '100%' }}>
            <InputLabel htmlFor="component-outlined">Email</InputLabel>
            <OutlinedInput inputRef={emailInput} id="component-outlined" label="email" />
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel htmlFor="component-outlined">Password</InputLabel>
            <OutlinedInput
              inputRef={passwordInput}
              id="component-outlined"
              label="password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            sx={{ width: '100%', height: 'full' }}
          >
            Login
          </LoadingButton>
        </form>
      </Container>
    </Container>
  );
}
