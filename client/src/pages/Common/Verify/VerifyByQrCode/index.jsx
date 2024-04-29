/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useContractHook from '../../../../hooks/useContractHook';

import { Container, Paper, Typography } from '@mui/material';
import Loader from '../../../../components/Loader';
import Swal2 from 'sweetalert2';
import QRCodeScanner from '../../../../components/QRCodeScanner';

import { checkIsOrderExist } from '../../../../utils/web3func/orderFuncs';

export default function VerifyByQrCode() {
  const [id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const contract = useContractHook((state) => state.contract);
  const account = useContractHook((state) => state.account);

  const navigate = useNavigate();

  useEffect(() => {
    const handleCheckOrder = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const isOrderExist = await checkIsOrderExist(account, contract, id);
          if (isOrderExist) {
            Swal2.fire({
              icon: 'success',
              title: 'Order Found',
              text: 'Your order has been found!'
            });
            navigate(`/verify/order/${id}`);
          } else {
            Swal2.fire({
              icon: 'error',
              title: 'Order Not Found',
              text: 'Your order is not found!'
            });
          }
        } catch (err) {
          console.log(err);
        }
        setIsLoading(false);
      }
    };

    handleCheckOrder();
  }, [id]);

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{
          my: '4px',
          py: '20px',
          maxHeight: '92vh',
          overflow: 'auto',
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          bgcolor: 'white'
        }}
      >
        <Typography sx={{ mx: 'auto', fontWeight: 'bold' }} variant="h5">
          Verify By QR Code
        </Typography>
        <Container
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
        >
          {isLoading ? <Loader /> : <QRCodeScanner setResult={setId} />}
        </Container>
      </Paper>
    </Container>
  );
}
