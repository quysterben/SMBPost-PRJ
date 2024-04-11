import PropTypes from 'prop-types';

import { Container, Stack } from '@mui/material';

import Sidebar from '../components/Sidebar';
export default function DefaultLayout({ children }) {
  return (
    <Stack direction="row">
      <Sidebar />
      <Container sx={{ width: '240px' }} />
      <Container sx={{ flex: '1', padding: 0, display: 'flex', flexDirection: 'column' }}>
        <Container sx={{ height: '24px' }} />
        {children}
      </Container>
    </Stack>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired
};
