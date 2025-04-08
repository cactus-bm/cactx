import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Snackbar, Alert, Tooltip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import { saveStateToLocalStorage, loadStateFromLocalStorage, hasSavedState } from '../store/persistenceUtils';

const AppHeader = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [hasSaved, setHasSaved] = useState(false);
  
  useEffect(() => {
    // Check if there is saved state on component mount
    setHasSaved(hasSavedState());
  }, []);
  
  const handleSaveState = () => {
    const success = saveStateToLocalStorage();
    setSnackbar({
      open: true,
      message: success ? 'Application state saved successfully!' : 'Failed to save application state.',
      severity: success ? 'success' : 'error'
    });
    setHasSaved(true);
  };
  
  const handleLoadState = () => {
    const result = loadStateFromLocalStorage();
    setSnackbar({
      open: true,
      message: result.message,
      severity: result.success ? 'success' : 'warning'
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
          
          {/* Save/Load buttons */}
          <Box sx={{ borderLeft: 1, borderColor: 'rgba(255,255,255,0.3)', pl: 2, ml: 1, display: 'flex' }}>
            <Tooltip title="Save application state">
              <IconButton color="inherit" onClick={handleSaveState}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={hasSaved ? "Load saved application state" : "No saved state available"}>
              <span>
                <IconButton 
                  color="inherit" 
                  onClick={handleLoadState} 
                  disabled={!hasSaved}
                >
                  <UploadIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
      
      {/* Feedback snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default AppHeader;
