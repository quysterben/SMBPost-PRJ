/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import {
  Autocomplete,
  Container,
  FormControl,
  TextField,
  IconButton,
  Button,
  Input,
  InputLabel,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InventoryIcon from '@mui/icons-material/Inventory';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddIcon from '@mui/icons-material/Add';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { grey } from '@mui/material/colors';

import requestApi from '../../../utils/fetchAPI';

export default function CreateOrder() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickOpenRoute = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseRoute = () => {
    setAnchorEl(null);
  };

  const currUserName = localStorage.getItem('userName');
  const currUserEmail = localStorage.getItem('userEmail');
  const currUserAddress = localStorage.getItem('userAddress');

  const [loading, setLoading] = useState(true);
  const [customerDatas, setCustomerDatas] = useState([]);
  const [staffDatas, setStaffDatas] = useState([]);

  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [locationList, setLocationList] = useState([]);
  const note = useRef('');

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

  const handleSubmitLocation = (value) => {
    if (value) {
      setLocationList([...locationList, value]);
      handleCloseRoute();
    }
  };
  const handleDeleteLocaltion = (index) => {
    const newLocationList = locationList.filter((_, i) => i !== index);
    setLocationList(newLocationList);
  };

  const handleSubmit = async () => {
    console.log(sender, receiver, locationList, note.current.value);
  };

  if (loading) return <div>Loading...</div>;
  return (
    <Container>
      <Container sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Container>
      <Container sx={{ display: 'flex', px: '40px' }}>
        <Container>
          <form
            style={{
              width: '100%',
              margin: '8px auto',
              padding: '0 5%',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              borderRight: '1px solid #ccc'
            }}
          >
            <FormControl sx={{ display: 'flex' }} fullWidth>
              <Container
                sx={{
                  mt: '20px',
                  mb: '4px',
                  p: 0,
                  border: '1px solid #ccc',
                  width: '162px',
                  height: '162px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {image && (
                  <img
                    src={image || null}
                    style={{ width: '160px', height: '160px', borderRadius: '12px' }}
                    alt="image"
                  />
                )}
              </Container>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                sx={{ width: '160px', mx: 'auto' }}
                startIcon={<CloudUploadIcon />}
                color="warning"
              >
                Upload Img
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
            </FormControl>
            <FormControl fullWidth>
              <Autocomplete
                disablePortal
                options={customerDatas.length > 0 ? customerDatas : []}
                sx={{ width: '100%' }}
                getOptionDisabled={(option) => option === receiver}
                onChange={(e, value) => setSender(value)}
                renderInput={(params) => <TextField {...params} label="Sender" />}
              />
            </FormControl>
            <FormControl fullWidth>
              <Autocomplete
                options={customerDatas.length > 0 ? customerDatas : []}
                disablePortal
                getOptionDisabled={(option) => option === sender}
                sx={{ width: '100%' }}
                onChange={(e, value) => setReceiver(value)}
                renderInput={(params) => <TextField {...params} label="Receiver" />}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Note</InputLabel>
              <Input id="component-outlined" inputRef={note} multiline />
            </FormControl>
          </form>
        </Container>
        <Container sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          <Container sx={{ p: 0 }}>
            {sender && receiver && (
              <Timeline position="alternate">
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="success">
                      <InventoryIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {sender.label}
                    </Typography>
                    <Typography>{sender.value.address}</Typography>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="secondary">
                      <SupportAgentIcon />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {currUserName}
                    </Typography>
                    <Typography>{currUserAddress}</Typography>
                  </TimelineContent>
                </TimelineItem>
                {locationList.map((location, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteLocaltion(index)}
                      >
                        <LocalShippingIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6" component="span">
                        {location.label}
                      </Typography>
                      <Typography>{location.value.address}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        cursor: 'pointer'
                      }}
                      onClick={handleClickOpenRoute}
                    >
                      <AddIcon sx={{ ':hover': { color: grey[800] } }} />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent />
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="success">
                      <ReceiptIcon />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {receiver.label}
                    </Typography>
                    <Typography>{receiver.value.address}</Typography>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            )}
            <Menu
              anchorEl={anchorEl}
              open={open}
              elevation={0}
              onClose={handleCloseRoute}
              anchorOrigin={{
                vertical: locationList.length % 2 === 0 ? 'right' : 'bottom',
                horizontal: locationList.length % 2 === 0 ? 'right' : 'left'
              }}
              transformOrigin={{
                vertical: locationList.length % 2 === 0 ? 'top' : 'center',
                horizontal: locationList.length % 2 === 0 ? 'left' : 'right'
              }}
            >
              <Container sx={{ width: '240px' }}>
                <Autocomplete
                  options={staffDatas.length > 0 ? staffDatas : []}
                  size="small"
                  sx={{ width: '100%' }}
                  getOptionDisabled={(option) => locationList.includes(option)}
                  onChange={(e, value) => handleSubmitLocation(value)}
                  renderInput={(params) => <TextField {...params} label="Location" />}
                />
              </Container>
            </Menu>
          </Container>
        </Container>
      </Container>
      <Container sx={{ display: 'flex', gap: '8px', mt: '40px', justifyContent: 'flex-end' }}>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </Container>
    </Container>
  );
}
