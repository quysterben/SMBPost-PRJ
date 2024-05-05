/* eslint-disable no-unused-vars */
import { Container, Typography } from '@mui/material';
import { blue, brown, green, orange, purple, red } from '@mui/material/colors';

import {
  customerIcon,
  doneOrderIcon,
  orderIcon,
  staffIcon,
  storehouseIcon,
  todayRequest
} from '../../../../const';

import Proptypes from 'prop-types';
TotalCount.propTypes = {
  centers: Proptypes.number,
  storehouses: Proptypes.number,
  customers: Proptypes.number,
  orders: Proptypes.number,
  successOrders: Proptypes.number,
  todayOrders: Proptypes.number
};

export default function TotalCount({
  centers,
  storehouses,
  customers,
  orders,
  successOrders,
  todayOrders
}) {
  return (
    <Container sx={{ display: 'flex' }}>
      <Container
        sx={{
          width: '167px',
          height: '170px',
          bgcolor: blue[50],
          borderRadius: '12px',
          display: 'flex',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <img src={staffIcon} alt="staff" />
        <Container sx={{ color: blue[400] }}>
          <Typography fontWeight="bold" textAlign="center">
            Centers
          </Typography>
          <Typography sx={{ mt: '4px' }} textAlign="center">
            {centers}
          </Typography>
        </Container>
      </Container>
      <Container
        sx={{
          width: '167px',
          height: '170px',
          bgcolor: orange[50],
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <img src={storehouseIcon} width={48} alt="staff" />
        <Container sx={{ color: orange[400] }}>
          <Typography fontWeight="bold" textAlign="center">
            Storehouses
          </Typography>
          <Typography sx={{ mt: '4px' }} textAlign="center">
            {storehouses}
          </Typography>
        </Container>
      </Container>
      <Container
        sx={{
          width: '167px',
          height: '170px',
          bgcolor: green[50],
          borderRadius: '12px',
          display: 'flex',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <img width={48} src={customerIcon} alt="staff" />
        <Container sx={{ color: green[400] }}>
          <Typography fontWeight="bold" textAlign="center">
            Customers
          </Typography>
          <Typography sx={{ mt: '4px' }} textAlign="center">
            {customers}
          </Typography>
        </Container>
      </Container>
      <Container
        sx={{
          width: '167px',
          height: '170px',
          bgcolor: red[50],
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <img width={48} src={orderIcon} alt="staff" />
        <Container sx={{ color: red[400] }}>
          <Typography fontWeight="bold" textAlign="center">
            Orders
          </Typography>
          <Typography sx={{ mt: '4px' }} textAlign="center">
            {orders}
          </Typography>
        </Container>
      </Container>
      <Container
        sx={{
          width: '167px',
          height: '170px',
          bgcolor: brown[50],
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <img width="48" src={doneOrderIcon} alt="staff" />
        <Container sx={{ color: brown[400] }}>
          <Typography fontWeight="bold" textAlign="center">
            Delivered
          </Typography>
          <Typography sx={{ mt: '4px' }} textAlign="center">
            {successOrders}
          </Typography>
        </Container>
      </Container>
      <Container
        sx={{
          width: '167px',
          height: '170px',
          bgcolor: purple[50],
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          cursor: 'pointer'
        }}
      >
        <img width={48} src={todayRequest} alt="staff" />
        <Container sx={{ color: purple[400] }}>
          <Typography fontWeight="bold" textAlign="center">
            Requested
          </Typography>
          <Typography sx={{ mt: '4px' }} textAlign="center">
            {todayOrders}
          </Typography>
        </Container>
      </Container>
    </Container>
  );
}
