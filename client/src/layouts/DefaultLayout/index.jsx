import PropTypes from 'prop-types';

import { Container, Stack } from '@mui/material';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
export default function DefaultLayout({ children }) {
  return (
    <Stack direction="row">
      <Sidebar />
      <Container sx={{ flex: '1', padding: 0, display: 'flex', flexDirection: 'column' }}>
        <Header />
        {children}
      </Container>
    </Stack>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired
};
