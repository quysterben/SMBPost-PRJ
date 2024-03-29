import { useNavigate } from 'react-router-dom';

import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button
} from '@mui/material';
import { grey } from '@mui/material/colors';

export default function CenterOrders() {
  const navigate = useNavigate();

  return (
    <Container sx={{ bgcolor: grey[100], flex: 1, height: '100vh', margin: 0, padding: 0 }}>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          height: '48px'
        }}
      >
        <Button onClick={() => navigate('create')} variant="contained">
          Create new order
        </Button>
      </Container>
      <TableContainer sx={{ width: '96%', mx: 'auto', mt: '12px' }} component={Paper}>
        <Table aria-label="User management">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sender</TableCell>
              <TableCell>Receiver</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Now At</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
