import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import JobTable from './components/JobTable';
import Box from '@mui/material/Box'; // Import Box from MUI

function App() {
  return (
    <ThemeProvider>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        overflow: 'hidden'
      }}>
        <Navbar />
        <Box sx={{ 
          flexGrow: 1,
          overflow: 'hidden'
        }}>
          <JobTable />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;