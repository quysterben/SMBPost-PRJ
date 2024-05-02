import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useContractHook from '../../../hooks/useContractHook';

import requestApi from '../../../utils/fetchAPI';
import { getOrdersByCustomerEmail } from '../../../utils/web3func/orderFuncs';

import {
  Paper,
  Container,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { blue } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';

export default function CustomerOrders() {
  const navigate = useNavigate();

  const currUserEmail = localStorage.getItem('userEmail');
  const account = useContractHook((state) => state.account);
  const contract = useContractHook((state) => state.contract);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userRes = await requestApi('user', 'GET');
        console.log(userRes.data.users);
        const res = await getOrdersByCustomerEmail(account, contract, currUserEmail);
        setOrders(res.requestedRes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrder();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    {
      field: 'sender',
      headerName: 'Sender',
      width: 160
    },
    {
      field: 'receiver',
      headerName: 'Receiver',
      width: 160
    },
    {
      field: 'nowAt',
      headerName: 'Now At',
      width: 160
    },
    {
      field: 'note',
      headerName: 'Note',
      width: 200
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        return <Chip variant="filled" label={params.value.text} color={params.value.color} />;
      }
    },
    {
      field: 'timestamp',
      headerName: 'Updated At',
      type: 'string',
      width: 180
    },
    {
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => navigate(`/verify/order/${params.row.id}`)}
            variant="contained"
            color="primary"
          >
            <VisibilityIcon sx={{ ':hover': { color: blue[400] } }} />
          </IconButton>
        );
      }
    }
  ];

  //   Option: Role
  const [optionRole, setOptionRole] = useState('all');
  const handleChangeOptionRole = (event, newOptionRole) => {
    if (newOptionRole !== null) {
      setOptionRole(newOptionRole);
    }
  };

  //   Option: Status
  const [optionStatus, setOptionStatus] = useState('all');
  const handleChangeOptionStatus = (event, newOptionStatus) => {
    if (newOptionStatus !== null) {
      setOptionStatus(newOptionStatus);
    }
  };

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{
          my: '4px',
          py: '20px',
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          bgcolor: 'white'
        }}
      >
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Orders Management
          </Typography>
        </Container>
        <Container
          sx={{
            display: 'flex',
            flex: '1',
            width: '100%',
            py: '4px',
            flexDirection: 'column',
            gap: '8px',
            justifyContent: 'center',
            my: 'auto'
          }}
        >
          <ToggleButtonGroup
            onChange={handleChangeOptionRole}
            value={optionRole}
            color="primary"
            size="small"
            exclusive
          >
            <ToggleButton value="all">{`All`}</ToggleButton>
            <ToggleButton value="sender">{`Be Sender`}</ToggleButton>
            <ToggleButton value="receiver">{`Be Receiver`}</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            onChange={handleChangeOptionStatus}
            value={optionStatus}
            size="small"
            exclusive
          >
            <ToggleButton value="all">{`All`}</ToggleButton>
            <ToggleButton value="requested">{`Requested`}</ToggleButton>
            <ToggleButton value="intransit">{`In Transit`}</ToggleButton>
            <ToggleButton value="delivered">{`Delivered`}</ToggleButton>
            <ToggleButton value="cancelled">{`Cancelled`}</ToggleButton>
          </ToggleButtonGroup>
        </Container>
        <Container sx={{ display: 'flex' }}>
          <DataGrid
            slots={{
              loadingOverlay: LinearProgress
            }}
            loading={orders.length === 0}
            rows={orders}
            sx={{ height: '72vh' }}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8
                }
              }
            }}
            pageSizeOptions={[8]}
          />
        </Container>
      </Paper>
    </Container>
  );
}
