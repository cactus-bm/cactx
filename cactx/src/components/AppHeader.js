import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer' 
          }}
          onClick={() => navigate('/')}
        >
          <span style={{ color: '#63a4ff' }}>Cact</span>
          <span style={{ color: '#60ad5e' }}>X</span>
          <Typography variant="subtitle2" component="span" sx={{ ml: 1 }}>
            Merger Modeling
          </Typography>
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/scenarios')}
          >
            New Scenario
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/comparison')}
          >
            Compare
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/reports')}
          >
            Reports
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
