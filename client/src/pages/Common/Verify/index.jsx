import { useNavigate } from 'react-router-dom';

import { Container, Paper, Typography } from '@mui/material';

const QRCodeImgURL =
  'https://res.cloudinary.com/dbinjkjko/image/upload/v1714028004/res/assets/n7txr9m8zam20chbsvvb.webp';
const IDCodeImgURL =
  'https://res.cloudinary.com/dbinjkjko/image/upload/v1714028005/res/assets/ihgiyeoovz2igrarwv7b.webp';

export default function verify() {
  const navigate = useNavigate();

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{
          py: '20px',
          overflow: 'auto',
          display: 'flex',
          minHeight: '100%',
          height: '92vh',
          flexDirection: 'column',
          gap: '20px',
          bgcolor: 'white'
        }}
      >
        <Typography sx={{ mx: 'auto', fontWeight: 'bold' }} variant="h5">
          Verify and Track Your Order
        </Typography>
        <Container
          sx={{
            display: 'flex',
            width: 'full',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            mt: '100px',
            height: '50vh'
          }}
        >
          <img
            className="verify-img"
            onClick={() => navigate('by-qr-code')}
            src={QRCodeImgURL}
            width="260"
            height="260"
            alt="QR Code"
          />
          <img
            className="verify-img"
            onClick={() => navigate('by-id')}
            src={IDCodeImgURL}
            width="260"
            height="260"
            alt="ID Code"
          />
        </Container>
      </Paper>
    </Container>
  );
}
