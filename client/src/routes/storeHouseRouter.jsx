import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

export default function StoreHouseRouter({ children }) {
  const currRole = localStorage.getItem('userRole');
  return currRole === 'storehouse' ? children : <Navigate to="/" />;
}

StoreHouseRouter.propTypes = {
  children: PropTypes.node.isRequired
};
