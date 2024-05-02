/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import useContractHook from '../../../hooks/useContractHook';

import { getOrdersByCustomerEmail } from '../../../utils/web3func/orderFuncs';

import { Paper, Container, Typography, LinearProgress, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 120 },
  {
    field: 'sender',
    headerName: 'Sender',
    width: 200
  },
  {
    field: 'receiver',
    headerName: 'Receiver',
    width: 200
  },
  {
    field: 'nowAt',
    headerName: 'Now At',
    width: 200
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
    width: 200
  }
];

export default function CustomerOrders() {
  const currUserEmail = localStorage.getItem('userEmail');
  const account = useContractHook((state) => state.account);
  const contract = useContractHook((state) => state.contract);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrdersByCustomerEmail(account, contract, currUserEmail);
        setOrders(res.requestedRes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrder();
  }, []);

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
          gap: '20px',
          bgcolor: 'white'
        }}
      >
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Orders Management
          </Typography>
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
          ></DataGrid>
        </Container>
      </Paper>
    </Container>
  );
}
