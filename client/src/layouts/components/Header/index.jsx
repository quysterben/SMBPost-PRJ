import { Avatar, Container, Typography } from '@mui/material';

export default function Header() {
  const currUsername = localStorage.getItem('userName');

  return (
    <Container
      sx={{
        display: 'flex',
        height: '50px',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '10px',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: 'white',
        zIndex: 1
      }}
    >
      <Avatar>{currUsername.slice(0, 1)}</Avatar>
      <Typography>{currUsername}</Typography>
    </Container>
  );
}
