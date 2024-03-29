import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  Autocomplete,
  Container,
  FormControl,
  TextField,
  IconButton,
  Button,
  Input
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import InputMultipleLine from '../../../components/InputMultipleLine';

import requestApi from '../../../utils/fetchAPI';

export default function CreateOrder() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [customerDatas, setCustomerDatas] = useState([]);
  const [staffDatas, setStaffDatas] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const res = await requestApi('user/customers', 'GET');
        setCustomerDatas(
          res.data.customers.map((customer) => {
            return {
              label: customer.username,
              value: customer
            };
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    const fetchStaffData = async () => {
      try {
        const res = await requestApi('user/staffs', 'GET');
        setStaffDatas(
          res.data.staffs.map((staff) => {
            return {
              label: staff.username,
              value: staff
            };
          })
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchCustomerData();
    fetchStaffData();
    setLoading(false);
  }, []);

  const [image, setImage] = useState(null);
  const handleUploadImage = (event) => {
    if (!event.target.files.length) return;
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Container sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Button variant="contained">Submit</Button>
      </Container>
      <Container sx={{ display: 'flex', px: '40px' }}>
        <Container>
          <form
            style={{
              width: '100%',
              margin: '8px auto',
              padding: '5% 5%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              borderRight: '1px solid #ccc'
            }}
          >
            <FormControl fullWidth>
              <Autocomplete
                disablePortal
                options={customerDatas.length > 0 ? customerDatas : []}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Sender" />}
              />
            </FormControl>
            <FormControl fullWidth>
              <Autocomplete
                options={customerDatas.length > 0 ? customerDatas : []}
                disablePortal
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Receiver" />}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputMultipleLine />
            </FormControl>
            <FormControl sx={{ display: 'flex' }} fullWidth>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                sx={{ width: '200px' }}
                startIcon={<CloudUploadIcon />}
                color="success"
              >
                Upload image
                <Input
                  onChange={(e) => handleUploadImage(e)}
                  sx={{
                    clip: 'rect(0 0 0 0)',
                    clipPath: 'inset(50%)',
                    height: 1,
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    whiteSpace: 'nowrap',
                    width: 1
                  }}
                  type="file"
                  inputProps={{ accept: 'image/png, image/gif, image/jpeg' }}
                />
              </Button>
              <Container sx={{ mt: '20px', p: 0 }}>
                {image && (
                  <img
                    src={image || null}
                    style={{ width: '200px', height: '200px', borderRadius: '12px' }}
                    alt="image"
                  />
                )}
              </Container>
            </FormControl>
          </form>
        </Container>
        <Container sx={{ display: 'flex', flexDirection: 'column' }}>
          <Container sx={{ p: 0 }}>
            <form
              style={{
                width: '100%',
                margin: '8px auto',
                padding: '5% 5%',
                display: 'flex',
                gap: '24px'
              }}
            >
              <FormControl fullWidth>
                <Autocomplete
                  disablePortal
                  options={staffDatas.length > 0 ? staffDatas : []}
                  sx={{ width: '100%' }}
                  renderInput={(params) => <TextField {...params} label="Location" />}
                />
              </FormControl>
              <Button variant="contained" sx={{ width: '200px' }} color="success">
                Add timeline
              </Button>
            </form>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
