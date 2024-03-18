import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

export default function ShippingRouter({ children }) {
  const currRole = localStorage.getItem('userRole');
  return currRole === 'shippingCenter' ? children : <Navigate to="/" />;
}

ShippingRouter.propTypes = {
  children: PropTypes.node.isRequired
};
