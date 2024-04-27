import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useContractHook from '../../../../hooks/useContractHook';

import { checkIsOrderExist } from '../../../../utils/web3func/orderFuncs';

import { Container, Typography, Paper } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Swal2 from 'sweetalert2';
import { MuiOtpInput } from 'mui-one-time-password-input';

export default function VerifyByID() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const contract = useContractHook((state) => state.contract);
  const account = useContractHook((state) => state.account);

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const handleClickVerify = async () => {
    try {
      if (otp.trim().length < 8) {
        Swal2.fire({
          icon: 'error',
          title: 'Invalid ID Code',
          text: 'Please enter a valid ID Code!'
        });
      } else {
        setIsLoading(true);
        const isOrderExist = await checkIsOrderExist(account, contract, otp);
        if (isOrderExist) {
          Swal2.fire({
            icon: 'success',
            title: 'Order Found',
            text: 'Your order has been found!'
          });
          navigate(`/verify/order/${otp}`);
        } else {
          Swal2.fire({
            icon: 'error',
            title: 'Order Not Found',
            text: 'Your order is not found!'
          });
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{
          my: '4px',
          py: '20px',
          maxHeight: '680px',
          overflow: 'auto',
          minHeight: '680px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          bgcolor: 'white'
        }}
      >
        <Typography sx={{ mx: 'auto', fontWeight: 'bold' }} variant="h5">
          Verify By ID
        </Typography>
        <Typography sx={{ mx: 'auto', mt: '40px', fontStyle: 'italic' }} variant="h8">
          Please enter the ID Code of your order!
        </Typography>
        <Container sx={{ display: 'flex', justifyContent: 'center', width: '60%', mt: '16px' }}>
          <MuiOtpInput length={8} value={otp} onChange={handleChange} />
        </Container>
        <LoadingButton
          loading={isLoading}
          onClick={handleClickVerify}
          sx={{ width: '30%', mt: '24px', mx: 'auto', height: '48px' }}
          variant="outlined"
        >
          Verify
        </LoadingButton>
      </Paper>
    </Container>
  );
}
