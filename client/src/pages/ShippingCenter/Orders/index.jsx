import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useContractHook from '../../../hooks/useContractHook';

import requestApi from '../../../utils/fetchAPI';
import { getOrdersByStaffEmail } from '../../../utils/web3func/orderFuncs';

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
import AnimationButton from '../../../components/AnimationButton';
import { blue } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';

export default function CenterOrders() {
  const navigate = useNavigate();

  const currUserEmail = localStorage.getItem('userEmail');
  const account = useContractHook((state) => state.account);
  const contract = useContractHook((state) => state.contract);

  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    {
      field: 'sender',
      headerName: 'Sender',
      width: 160,
      valueGetter: (params) => {
        return users.find((user) => user.email === params).username;
      }
    },
    {
      field: 'receiver',
      headerName: 'Receiver',
      width: 160,
      valueGetter: (params) => {
        return users.find((user) => user.email === params).username;
      }
    },
    {
      field: 'nowAt',
      headerName: 'Now At',
      width: 160,
      valueGetter: (params) => {
        if (params === '') return '';
        return users.find((user) => user.email === params).username;
      }
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
            onClick={() => navigate(`${params.row.id}`)}
            variant="contained"
            color="primary"
          >
            <VisibilityIcon sx={{ ':hover': { color: blue[400] } }} />
          </IconButton>
        );
      }
    }
  ];

  //   Option: Status
  const [optionStatus, setOptionStatus] = useState('all');
  const handleChangeOptionStatus = (event, newOptionStatus) => {
    if (newOptionStatus !== null) {
      setOptionStatus(newOptionStatus);
    }
  };
  const generateTableDataFilterStatus = (data = [], optionFilter = 'all') => {
    if (optionFilter === 'requested') {
      return data.filter((item) => item.status.text === 'Requested');
    }
    if (optionFilter === 'intransit') {
      return data.filter((item) => item.status.text === 'Intransit');
    }
    if (optionFilter === 'delivered') {
      return data.filter((item) => item.status.text === 'Delivered');
    }
    if (optionFilter === 'cancelled') {
      return data.filter((item) => item.status.text === 'Cancelled');
    }
    return data;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const userRes = await requestApi('user', 'GET');
        setUsers(userRes.data.users);
        const res = await getOrdersByStaffEmail(account, contract, currUserEmail);
        setOrders(
          generateTableDataFilterStatus(
            [...res.requestedRes, ...res.deliveredRes, ...res.intransitRes, ...res.canceledRes],
            optionStatus
          )
        );
        console.log(res);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrder();
  }, [optionStatus]);

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
            width: '100%',
            py: '4px',
            gap: '8px',
            justifyContent: 'space-between',
            my: 'auto'
          }}
        >
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
          <AnimationButton navigateLink={'create'} />
        </Container>
        <Container sx={{ display: 'flex' }}>
          <DataGrid
            slots={{
              loadingOverlay: LinearProgress
            }}
            loading={isLoading}
            sx={{ height: '72vh' }}
            columns={columns}
            rows={orders}
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
