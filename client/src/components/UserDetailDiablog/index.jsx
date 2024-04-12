/* eslint-disable no-unused-vars */
import { Dialog, Avatar, Container, useMediaQuery, Typography, Chip } from '@mui/material';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import { useTheme } from '@mui/material/styles';

import Proptypes from 'prop-types';

import convertRoleToText from '../../utils/convertRoleToText';
import { useEffect } from 'react';

import { getOrdersByMail } from '../../utils/web3func/orderFuncs';

import useContractHook from '../../hooks/useContractHook';

export default function UserDetailDiablog(props) {
  const { onClose, open, user } = props;

  const handleClose = () => {
    onClose();
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const contract = useContractHook((state) => state.contract);
  const account = useContractHook((state) => state.account);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await getOrdersByMail(account, contract, user.email);
    };

    if (!user && !open) return;
    fetchOrder();
  }, [open, user]);

  if (!user) return null;
  return (
    <Dialog fullScreen={fullScreen} onClose={handleClose} open={open}>
      <Container
        sx={{
          width: '340px',
          height: '460px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <Avatar sx={{ width: '80px', height: '80px' }}>{user.username.slice(0, 1)}</Avatar>
        <Typography variant="h6">{user.username}</Typography>
        <Chip label={convertRoleToText(user.role)} color="success" variant="outlined" />
        <Container sx={{ display: 'flex', mt: '20px', alignItems: 'center' }}>
          <Container sx={{ width: '40%', textJustify: 'auto', mt: '0.8px' }}>
            <ContactPhoneRoundedIcon color="primary" fontSize="medium" />
          </Container>
          <Typography sx={{ width: '60%', fontSize: '12px', color: 'gray' }} variant="body1">
            {user.phonenumber}
          </Typography>
        </Container>
        <Container sx={{ display: 'flex', alignItems: 'center' }}>
          <Container sx={{ width: '40%', textJustify: 'auto', mt: '0.8px' }}>
            <ContactMailRoundedIcon color="primary" fontSize="medium" />
          </Container>
          <Typography sx={{ width: '60%', fontSize: '12px', color: 'gray' }} variant="body1">
            {user.email}
          </Typography>
        </Container>
        <Container sx={{ display: 'flex', alignItems: 'center' }}>
          <Container sx={{ width: '40%', textJustify: 'auto', mt: '0.8px' }}>
            <BusinessRoundedIcon color="primary" fontSize="medium" />
          </Container>
          <Typography sx={{ width: '60%', fontSize: '12px', color: 'gray' }} variant="body1">
            {user.address}
          </Typography>
        </Container>
      </Container>
    </Dialog>
  );
}

UserDetailDiablog.propTypes = {
  onClose: Proptypes.func,
  open: Proptypes.bool,
  user: Proptypes.object
};
