/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from 'react';
import moment from 'moment';
import { cancelAnOrder } from '../../../utils/web3func/transferFuncs';
import useContractHook from '../../../hooks/useContractHook';

import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Container,
  IconButton,
  Input,
  Box,
  Button,
  Typography,
  Modal
} from '@mui/material';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import Swal from 'sweetalert2';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  zIndex: 2
};

import PropTypes from 'prop-types';

export default function CancelOrderModal({ orderID }) {
  const contract = useContractHook((state) => state.contract);
  const address = useContractHook((state) => state.account);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    note.current.value = '';
  };

  const formRef = React.useRef(null);
  const note = React.useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const cancelReason = note.current.value;
      await cancelAnOrder(address, contract, { orderID, cancelReason });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Order has been canceled!',
        target: formRef.current
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        target: formRef.current
      });
    }
  };

  return (
    <div>
      <IconButton onClick={handleOpen} color="error" variant="outlined">
        <DoDisturbAltIcon />
      </IconButton>
      <Modal
        ref={formRef}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{ mb: '12px' }} id="modal-modal-title" variant="h6" component="h2">
            Cancel Order
          </Typography>
          <form
            style={{
              width: '100%',
              margin: '4px auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
            onSubmit={handleSubmit}
          >
            <FormControl sx={{ mt: '20px' }} fullWidth>
              <InputLabel>Order ID</InputLabel>
              <OutlinedInput defaultValue={orderID} label="Order ID" disabled />
            </FormControl>
            <FormControl sx={{ mt: '20px' }} fullWidth>
              <InputLabel htmlFor="component-outlined">Cancel Date</InputLabel>
              <OutlinedInput
                defaultValue={moment().format('YYYY-MM-DD').toString()}
                label="Cancel Date"
                disabled
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Note</InputLabel>
              <Input id="component-outlined" inputRef={note} multiline />
            </FormControl>
            <Container sx={{ display: 'flex', px: '0', gap: '8px', mt: '10px' }}>
              <Button type="submit" variant="contained" color="error" fullWidth>
                Cancel
              </Button>
              <Button onClick={handleClose} variant="outlined" fullWidth>
                Close
              </Button>
            </Container>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

CancelOrderModal.propTypes = {
  orderId: PropTypes.string.isRequired
};
