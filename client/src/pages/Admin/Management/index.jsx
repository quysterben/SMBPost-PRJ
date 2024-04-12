import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { blue, grey } from '@mui/material/colors';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  IconButton,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import CreateNewUserModal from '../../../components/ModalComponents/CreateNewUserModal';

import requestAPI from '../../../utils/fetchAPI';
import convertRoleToText from '../../../utils/convertRoleToText';

export default function Management() {
  const navigate = useNavigate();
  const [userDatas, setUserDatas] = useState([]);

  const fetchUserData = async () => {
    try {
      const res = await requestAPI('user', 'GET');
      setUserDatas(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const [optionStatus, setOptionStatus] = useState('all');
  const handleChangeOptionStatus = (event, newOptionStatus) => {
    if (newOptionStatus) {
      setOptionStatus(newOptionStatus);
    }
  };
  const generateUserListFilter = (users = [], optionFilter = 'total') => {
    if (optionFilter === 'shippingCenter') {
      return users.filter((user) => user?.role === 'shippingCenter');
    }
    if (optionFilter === 'storehouse') {
      return users.filter((user) => user?.role === 'storehouse');
    }
    if (optionFilter === 'customer') {
      return users.filter((user) => user?.role === 'customer');
    }
    return users;
  };

  const [optionRole, setOptionRole] = useState('all');
  const handleChangeOptionRole = (event, newOptionRole) => {
    if (newOptionRole) {
      setOptionRole(newOptionRole);
    }
  };
  const generateUserListFilterStatus = (users = [], optionFilter = 'total') => {
    if (optionFilter === 'active') {
      return users.filter((user) => user?.isActive);
    }
    if (optionFilter === 'inactive') {
      return users.filter((user) => !user?.isActive);
    }
    return users;
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Container sx={{ bgcolor: grey[100], flex: 1, height: '100vh', margin: 0, padding: 0 }}>
      <Container
        sx={{
          display: 'flex',
          height: '100px'
        }}
      >
        <Container
          sx={{
            display: 'flex',
            flex: '1',
            width: '100%',
            py: '4px',
            flexDirection: 'column',
            gap: '12px',
            justifyContent: 'center',
            my: 'auto'
          }}
        >
          <ToggleButtonGroup
            color="primary"
            size="small"
            value={optionStatus}
            exclusive
            onChange={handleChangeOptionStatus}
          >
            <ToggleButton value="all">
              {`All (${generateUserListFilter(userDatas).length})`}
            </ToggleButton>
            <ToggleButton value="active">
              {`Active (${generateUserListFilterStatus(userDatas, 'active').length})`}
            </ToggleButton>
            <ToggleButton value="inactive">
              {`Inactive (${generateUserListFilterStatus(userDatas, 'inactive').length})`}
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            size="small"
            value={optionRole}
            exclusive
            color="primary"
            onChange={handleChangeOptionRole}
          >
            <ToggleButton value="all">
              {`All (${generateUserListFilter(userDatas).length})`}
            </ToggleButton>
            <ToggleButton value="shippingCenter">
              {`Shipping Center (${generateUserListFilter(userDatas, 'shippingCenter').length})`}
            </ToggleButton>
            <ToggleButton value="storehouse">
              {`Storehouse (${generateUserListFilter(userDatas, 'storehouse').length})`}
            </ToggleButton>
            <ToggleButton value="customer">
              {`Customer (${generateUserListFilter(userDatas, 'customer').length})`}
            </ToggleButton>
          </ToggleButtonGroup>
        </Container>
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width: '200px'
          }}
        >
          <CreateNewUserModal refetch={fetchUserData} />
        </Container>
      </Container>
      <TableContainer
        sx={{ width: '96%', mx: 'auto', mt: '12px', maxHeight: '570px' }}
        component={Paper}
      >
        <Table stickyHeader aria-label="User management">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generateUserListFilterStatus(
              generateUserListFilter(userDatas, optionRole),
              optionStatus
            ).map((user) => (
              <TableRow
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  bgcolor: user.isActive || grey[300]
                }}
                key={user._id}
              >
                <TableCell>{user._id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{convertRoleToText(user.role)}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  {user.role == 'admin' ? null : (
                    <IconButton onClick={() => navigate(user._id)}>
                      <VisibilityIcon sx={{ ':hover': { color: blue[400] } }} />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
