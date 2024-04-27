import { Container, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function VerifyOrderDetail() {
  const { orderID } = useParams();
  console.log(orderID);

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
          Order Tracking
        </Typography>
      </Paper>
    </Container>
  );
}
