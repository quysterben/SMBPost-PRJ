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
          Verify and Track Your Order
        </Typography>
        <Container
          sx={{ display: 'flex', width: 'full', justifyContent: 'space-evenly', mt: '100px' }}
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
