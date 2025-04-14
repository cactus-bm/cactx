import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Snackbar, Alert, Tooltip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { saveStateToLocalStorage, loadStateFromLocalStorage, hasSavedState } from '../store/persistenceUtils';
import store from '../store';

const AppHeader = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [hasSaved, setHasSaved] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    // Check if there is saved state on component mount
    setHasSaved(hasSavedState());
  }, []);

  // Handle saving to localStorage
  const handleSaveState = () => {
    const success = saveStateToLocalStorage();
    setSnackbar({
      open: true,
      message: success ? 'Application state saved successfully!' : 'Failed to save application state.',
      severity: success ? 'success' : 'error'
    });
    setHasSaved(true);
  };
  
  // Handle loading from localStorage
  const handleLoadState = () => {
    const result = loadStateFromLocalStorage();
    setSnackbar({
      open: true,
      message: result.message,
      severity: result.success ? 'success' : 'warning'
    });
  };

  // Save state to JSON file
  const saveStateToFile = () => {
    try {
      const state = store.getState();
      const serializedState = JSON.stringify(state, null, 2);
      
      // Create a blob and generate download link
      const blob = new Blob([serializedState], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'details.json';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      setSnackbar({
        open: true,
        message: 'State saved to details.json',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving state to file:', error);
      setSnackbar({
        open: true,
        message: `Error saving state: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Handle file selection for loading
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const state = JSON.parse(e.target.result);
        
        // Update Redux store with loaded data
        if (state.companies) {
          store.dispatch({ type: 'companies/setCompanies', payload: state.companies.companies });
        }
        
        if (state.scenarios) {
          store.dispatch({ type: 'scenarios/setScenarios', payload: state.scenarios.scenarios });
        }
        
        setSnackbar({
          open: true,
          message: 'State loaded successfully from file',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setSnackbar({
          open: true,
          message: `Error loading file: ${error.message}`,
          severity: 'error'
        });
      }
    };
    
    reader.onerror = () => {
      setSnackbar({
        open: true,
        message: 'Error reading file',
        severity: 'error'
      });
    };
    
    reader.readAsText(file);
    // Reset file input
    event.target.value = null;
  };
  
  // Trigger file input click
  const openFileSelector = () => {
    fileInputRef.current.click();
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        {/* JSON File Save/Load buttons in top left */}
        <Box sx={{ display: 'flex', mr: 3 }}>
          <Tooltip title="Save to JSON file (details.json)">
            <IconButton color="inherit" onClick={saveStateToFile}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Load from JSON file">
            <IconButton color="inherit" onClick={openFileSelector}>
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleFileSelect}
          />
        </Box>
        
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
          <span style={{ color: '#63a4ff' }}>M</span>
          <span style={{ color: '#60ad5e' }}>M</span>
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
          
          {/* Local Storage Save/Load buttons */}
          <Box sx={{ borderLeft: 1, borderColor: 'rgba(255,255,255,0.3)', pl: 2, ml: 1, display: 'flex' }}>
            <Tooltip title="Save to browser storage">
              <IconButton color="inherit" onClick={handleSaveState}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={hasSaved ? "Load from browser storage" : "No saved state available"}>
              <span>
                <IconButton color="inherit" onClick={handleLoadState} disabled={!hasSaved}>
                  <FolderOpenIcon />
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default AppHeader;
