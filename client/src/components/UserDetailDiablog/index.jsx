import { Dialog, Avatar, Container, useMediaQuery, Typography, Chip } from '@mui/material';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useTheme } from '@mui/material/styles';
import Loader from '../Loader';

import Proptypes from 'prop-types';
import { useEffect, useState } from 'react';
import useContractHook from '../../hooks/useContractHook';

import convertRoleToText from '../../utils/convertRoleToText';
import { getOrdersByCustomerEmail, getOrdersByStaffEmail } from '../../utils/web3func/orderFuncs';

export default function UserDetailDiablog(props) {
  const { onClose, open, user } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    onClose();
    setOrderCount(0);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const contract = useContractHook((state) => state.contract);
  const account = useContractHook((state) => state.account);

  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        let res = null;
        if (user.role === 'customer') {
          res = await getOrdersByCustomerEmail(account, contract, user.email);
          setOrderCount(res[0].length);
        } else {
          res = await getOrdersByStaffEmail(account, contract, user.email);
          setOrderCount(res.length);
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
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
        {isLoading ? (
          <Container
            sx={{
              minHeight: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Loader />
          </Container>
        ) : (
          <>
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
            <Container sx={{ display: 'flex', alignItems: 'center' }}>
              <Container sx={{ width: '40%', textJustify: 'auto', mt: '0.8px' }}>
                {user.role !== 'customer' ? (
                  <LocalShippingOutlinedIcon color="primary" fontSize="medium" />
                ) : (
                  <InventoryOutlinedIcon color="primary" fontSize="medium" />
                )}
              </Container>
              <Typography sx={{ width: '60%', fontSize: '12px', color: 'gray' }} variant="body1">
                {orderCount}
              </Typography>
            </Container>
          </>
        )}
      </Container>
    </Dialog>
  );
}

UserDetailDiablog.propTypes = {
  onClose: Proptypes.func,
  open: Proptypes.bool,
  user: Proptypes.object
};
