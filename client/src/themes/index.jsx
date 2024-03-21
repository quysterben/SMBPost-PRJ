import { createTheme as createMuiTheme } from '@mui/material';

function createTheme() {
  return createMuiTheme({
    breakpoints: {
      values: {}
    },
    shape: {
      borderRadius: 8
    },
    components: {
      padding: 0,
      margin: 0
    }
  });
}

export default createTheme;
