import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './App';
import createTheme from './themes';

import './index.css';

const customTheme = createTheme();
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={customTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
