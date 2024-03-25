import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { FormControl, InputLabel, OutlinedInput, Select, MenuItem, Container } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default function CreateNewUserModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [role, setRole] = React.useState('');
  const handleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Create New User
      </Button>
      <Modal
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
          >
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Username</InputLabel>
              <OutlinedInput id="component-outlined" label="username" />
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
                <MenuItem value={10}>Customer</MenuItem>
                <MenuItem value={20}>Shipping Center</MenuItem>
                <MenuItem value={30}>Storehouse</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Email</InputLabel>
              <OutlinedInput id="component-outlined" label="email" />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Phone number</InputLabel>
              <OutlinedInput id="component-outlined" label="phone-number" />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Address</InputLabel>
              <OutlinedInput id="component-outlined" label="address" />
            </FormControl>
            <Container sx={{ display: 'flex', px: '0', gap: '8px' }}>
              <Button variant="contained" color="primary" fullWidth>
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
