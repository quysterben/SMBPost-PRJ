import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

export default function AdminRouter({ children }) {
  const currRole = localStorage.getItem('userRole');
  return currRole === 'admin' ? children : <Navigate to="/" />;
}

AdminRouter.propTypes = {
  children: PropTypes.node.isRequired
};
