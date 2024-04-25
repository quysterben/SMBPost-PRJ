import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { FormControl, InputLabel, OutlinedInput, Select, MenuItem, Container } from '@mui/material';

import Swal from 'sweetalert2';

import requestAPI from '../../../utils/fetchAPI';

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

CreateNewUserModal.propTypes = {
  refetch: PropTypes.func
};

export default function CreateNewUserModal({ refetch }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setRole('');
    usernameRef.current.value = '';
    emailRef.current.value = '';
    phoneRef.current.value = '';
  };

  const [role, setRole] = React.useState('');
  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const formRef = React.useRef(null);

  const usernameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const phoneRef = React.useRef(null);
  const addressRef = React.useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;
    const address = addressRef.current.value;

    const data = {
      username,
      email,
      phonenumber: phone,
      address,
      role
    };

    try {
      await requestAPI('user/create-user', 'POST', data);
      await refetch();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Create new user successfully'
      });
      handleClose();
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
      <Button variant="contained" onClick={handleOpen}>
        Create New User
      </Button>
      <Modal
        ref={formRef}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{ mb: '12px' }} id="modal-modal-title" variant="h6" component="h2">
            Create new user
          </Typography>
          <form
            style={{
              width: '100%',
              margin: '8px auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
            onSubmit={handleSubmit}
          >
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Username</InputLabel>
              <OutlinedInput inputRef={usernameRef} id="component-outlined" label="username" />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value={'shippingCenter'}>Shipping Center</MenuItem>
                <MenuItem value={'storehouse'}>Storehouse</MenuItem>
                <MenuItem value={'customer'}>Customer</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Email</InputLabel>
              <OutlinedInput inputRef={emailRef} id="component-outlined" label="email" />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Phone number</InputLabel>
              <OutlinedInput inputRef={phoneRef} id="component-outlined" label="phone-number" />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Address</InputLabel>
              <OutlinedInput inputRef={addressRef} id="component-outlined" label="address" />
            </FormControl>
            <Container sx={{ display: 'flex', px: '0', gap: '8px' }}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Create
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
