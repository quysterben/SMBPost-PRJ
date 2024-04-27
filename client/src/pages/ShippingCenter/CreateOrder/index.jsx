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
  Paper
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InventoryIcon from '@mui/icons-material/Inventory';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddIcon from '@mui/icons-material/Add';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { grey } from '@mui/material/colors';

import requestApi from '../../../utils/fetchAPI';

import { useForm } from 'react-hook-form';

import Swal from 'sweetalert2';

import { createOrder } from '../../../utils/web3func/orderFuncs';

import useContractHook from '../../../hooks/useContractHook';

import Loader from '../../../components/Loader';

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
              label: customer.username + ' - ' + customer.phonenumber + ' - ' + customer.address,
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
              label: staff.username + ' - ' + staff.phonenumber + ' - ' + staff.address,
              value: staff
            };
          })
        );
      } catch (err) {
        console.log(err);
      }
    };

    Promise.all([fetchCustomerData(), fetchStaffData()]);
    setLoading(false);
  }, []);

  const [image, setImage] = useState(null);
  const handleUploadImage = (event) => {
    if (!event.target.files.length) return;
    setImage({ image: event.target.files[0], url: URL.createObjectURL(event.target.files[0]) });
  };

  const handleSelectLocation = (value) => {
    if (value) {
      setLocationList([...locationList, value]);
      handleCloseRoute();
    }
  };
  const handleDeleteLocation = (index) => {
    const newLocationList = locationList.filter((_, i) => i !== index);
    setLocationList(newLocationList);
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const contract = useContractHook((state) => state.contract);
  const address = useContractHook((state) => state.account);

  const [submiting, setSubmiting] = useState(false);
  const onSubmit = async () => {
    if (!image) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please upload an image!'
      });
      return;
    }
    if (locationList.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please add location!'
      });
      return;
    }
    try {
      setSubmiting(true);
      const imageData = new FormData();
      imageData.append('image', image.image);
      const resImage = await requestApi('image/upload', 'POST', imageData);
      const imageURL = resImage.data.imageURL;
      await createOrder(address, contract, {
        centerEmail: currUserEmail,
        senderEmail: sender.value.email,
        receiverEmail: receiver.value.email,
        imageURL: imageURL,
        note: note.current.value,
        wayEmails: locationList.map((location) => location.value.email)
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Order created successfully!'
      });
      navigate(-1);
    } catch (err) {
      console.log(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <Container>
      <Container
        sx={{
          position: 'absolute',
          top: '50%',
          left: '53%',
          zIndex: 100
        }}
      >
        {submiting && <Loader />}
      </Container>
      <Paper
        elevation={3}
        sx={{
          pt: '32px',
          my: '40px',
          pb: '20px',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          opacity: submiting ? 0.4 : 1,
          bgcolor: 'white',
          pointerEvents: submiting ? 'none' : 'auto',
          userSelect: submiting ? 'none' : 'auto'
        }}
      >
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
              <FormControl fullWidth>
                <Autocomplete
                  disablePortal
                  options={customerDatas.length > 0 ? customerDatas : []}
                  sx={{ width: '100%' }}
                  getOptionDisabled={(option) => option === receiver}
                  onChange={(e, value) => setSender(value)}
                  renderInput={(params) => (
                    <TextField
                      error={errors.sender && true}
                      {...params}
                      {...register('sender', { required: true })}
                      label="Sender"
                      helperText={errors.sender && 'Sender is required'}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <Autocomplete
                  options={customerDatas.length > 0 ? customerDatas : []}
                  disablePortal
                  getOptionDisabled={(option) => option === sender}
                  sx={{ width: '100%' }}
                  onChange={(e, value) => setReceiver(value)}
                  renderInput={(params) => (
                    <TextField
                      error={errors.receiver && true}
                      {...params}
                      {...register('receiver', { required: true })}
                      label="Receiver"
                      helperText={errors.receiver && 'Receiver is required'}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">Note</InputLabel>
                <Input id="component-outlined" inputRef={note} multiline />
              </FormControl>
              <FormControl sx={{ display: 'flex' }} fullWidth>
                <Container
                  sx={{
                    mt: '20px',
                    mb: '4px',
                    p: 0,
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    width: '162px',
                    height: '162px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: image ? `url(${image.url})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    ':hover': {
                      filter: 'brightness(0.4)',
                      '& .addIcon': {
                        display: 'block'
                      }
                    }
                  }}
                >
                  <IconButton
                    component="label"
                    className="addIcon"
                    sx={{ mx: 'auto', display: 'none', color: 'white' }}
                  >
                    <AddAPhotoIcon />
                    <Input
                      onChange={(e) => handleUploadImage(e)}
                      sx={{
                        display: 'none',
                        overflow: 'hidden',
                        width: '100%',
                        height: '100%'
                      }}
                      type="file"
                      inputProps={{ accept: 'image/png, image/gif, image/jpeg' }}
                    />
                  </IconButton>
                </Container>
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
                        {sender.value.username}
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
                          onClick={() => handleDeleteLocation(index)}
                        >
                          <LocalShippingIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="h6" component="span">
                          {location.value.username}
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
                        {receiver.value.username}
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
                  vertical: locationList.length % 2 === 0 ? 'center' : 'bottom',
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
                    onChange={(e, value) => handleSelectLocation(value)}
                    renderInput={(params) => <TextField {...params} label="Location" />}
                  />
                </Container>
              </Menu>
            </Container>
          </Container>
        </Container>
        <Container sx={{ display: 'flex', gap: '8px', mt: '40px', justifyContent: 'flex-end' }}>
          <LoadingButton loading={submiting} onClick={handleSubmit(onSubmit)} variant="contained">
            Submit
          </LoadingButton>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Container>
      </Paper>
    </Container>
  );
}
