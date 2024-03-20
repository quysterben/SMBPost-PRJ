import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

export default function PrivateRouter({ children }) {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken ? children : <Navigate to="/login" />;
}

PrivateRouter.propTypes = {
  children: PropTypes.node.isRequired
};
