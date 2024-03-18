import { createTheme as createMuiTheme } from '@mui/material';

function createTheme() {
  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440
      }
    },
    shape: {
      borderRadius: 8
    }
  });
}

export default createTheme;
