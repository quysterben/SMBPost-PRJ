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
  InputLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import requestApi from '../../../utils/fetchAPI';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

export default function CreateOrder() {
  const navigate = useNavigate();

  const currUserName = localStorage.getItem('userName');
  const currUserEmail = localStorage.getItem('userEmail');

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
      console.log(locationList);
    }
  };

  const handleDeleteLocaltion = (index) => {
    const newLocationList = locationList.filter((_, i) => i !== index);
    setLocationList(newLocationList);
  };

  const handleSubmit = async () => {
    console.log(sender, receiver, note.current.value, locationList);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Container sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
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
                onChange={(e, value) => setSender(value)}
                renderInput={(params) => <TextField {...params} label="Sender" />}
              />
            </FormControl>
            <FormControl fullWidth>
              <Autocomplete
                options={customerDatas.length > 0 ? customerDatas : []}
                disablePortal
                sx={{ width: '100%' }}
                onChange={(e, value) => setReceiver(value)}
                renderInput={(params) => <TextField {...params} label="Receiver" />}
              />
            </FormControl>
            <FormControl fullWidth>
              <Autocomplete
                disablePortal
                options={staffDatas.length > 0 ? staffDatas : []}
                onChange={(e, value) => handleSubmitLocation(value)}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Add new route" />}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="component-outlined">Note</InputLabel>
              <Input id="component-outlined" inputRef={note} multiline />
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
              <Container
                sx={{
                  mt: '20px',
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
            </FormControl>
          </form>
        </Container>
        <Container sx={{ display: 'flex', flexDirection: 'column' }}>
          <Container sx={{ p: 0 }}>
            {sender && receiver && (
              <Timeline position="alternate">
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="success" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>{sender.label}</TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="success" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>{currUserName}</TimelineContent>
                </TimelineItem>
                {locationList.map((location, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteLocaltion(index)}
                      />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>{location.label}</TimelineContent>
                  </TimelineItem>
                ))}
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot />
                  </TimelineSeparator>
                  <TimelineContent>{receiver.label}</TimelineContent>
                </TimelineItem>
              </Timeline>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
