import { useEffect, useRef, useState } from 'react';

import {
  Container,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { blueGrey } from '@mui/material/colors';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Swal from 'sweetalert2';

import { useNavigate } from 'react-router-dom';

import requestAPI from '../../../utils/fetchAPI';

import { LOGO_URL } from '../../../const';

export default function Login() {
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
      navigate('/admin/dashboard');
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
        navigate('/storehouse/overview');
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
    <Container
      sx={{
        margin: 0,
        bgcolor: blueGrey[50],
        minWidth: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Container
        sx={{
          width: '500px',
          height: '80%',
          bgcolor: blueGrey[100],
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 3
        }}
      >
        <img src={LOGO_URL} width={240} height={240}></img>
        <form
          onSubmit={handleSubmitLogin}
          style={{
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '28px'
          }}
        >
          <FormControl sx={{ width: '80%' }}>
            <InputLabel htmlFor="component-outlined">Email</InputLabel>
            <OutlinedInput inputRef={emailInput} id="component-outlined" label="email" />
          </FormControl>
          <FormControl sx={{ width: '80%' }}>
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
            sx={{ width: '80%' }}
          >
            Login
          </LoadingButton>
        </form>
      </Container>
    </Container>
  );
}
