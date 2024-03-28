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
  IconButton
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

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Container sx={{ bgcolor: grey[100], flex: 1, height: '100vh', margin: 0, padding: 0 }}>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          height: '48px'
        }}
      >
        <CreateNewUserModal refetch={fetchUserData} />
      </Container>
      <TableContainer sx={{ width: '96%', mx: 'auto', mt: '12px' }} component={Paper}>
        <Table aria-label="User management">
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
            {userDatas.map((user) => (
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
