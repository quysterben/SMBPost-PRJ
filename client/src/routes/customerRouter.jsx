import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

export default function CustomerRouter({ children }) {
  const currRole = localStorage.getItem('userRole');
  return currRole === 'customer' ? children : <Navigate to="/" />;
}

CustomerRouter.propTypes = {
  children: PropTypes.node.isRequired
};
