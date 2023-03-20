import './App.css';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { BrowserRouter, Router } from 'react-router-dom';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainPage from './MainPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#256cdc',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f3f6f9',
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<MainPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
