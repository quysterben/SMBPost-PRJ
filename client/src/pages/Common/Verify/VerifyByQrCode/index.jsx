import { Container, Paper, Typography } from '@mui/material';
import QRCodeScanner from '../../../../components/QRCodeScanner';

export default function VerifyByQrCode() {
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
          Verify By QR Code
        </Typography>
        <Container
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
        >
          <QRCodeScanner />
        </Container>
      </Paper>
    </Container>
  );
}
