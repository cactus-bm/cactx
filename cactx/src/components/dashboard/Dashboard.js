import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCompany } from '../../store/companiesSlice';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Stack,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { selectScenarios } from '../../store/scenariosSlice';
import { selectCompanies, updateCompanyData } from '../../store/companiesSlice';

import DashboardSummary from './DashboardSummary';
import CompanyCard from './CompanyCard';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State for new company dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    id: '',
    cashOnHand: 0,
    arr: 0,
    investors: {
      equity: [],
      employees: [],
      safe: []
    }
  });
  const dispatch = useDispatch();
  const scenarios = useSelector(selectScenarios);
  const companies = useSelector(selectCompanies);
  
  // Open dialog for creating a new company
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // Close dialog for creating a new company
  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Reset form
    setNewCompany({
      name: '',
      id: '',
      cashOnHand: 0,
      arr: 0
    });
  };

  // Handle input changes for new company form
  const handleInputChange = (field) => (event) => {
    let value = event.target.value;
    
    // Format numbers for financial fields
    if (field === 'cashOnHand' || field === 'arr') {
      value = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    }
    
    // Auto-generate ID from name (lowercase, no spaces)
    if (field === 'name') {
      setNewCompany(prev => ({
        ...prev,
        [field]: value,
        id: value.toLowerCase().replace(/\s+/g, '')
      }));
    } else {
      setNewCompany(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Create a new company
  const handleCreateCompany = () => {
    // Create a new company object with default metrics
    const company = {
      ...newCompany,
      metrics: {
        valuation: newCompany.arr * 10, // Simple valuation calculation
        growthRate: 10,
        employees: 50,
        offices: 1
      }
    };
    
    // Add the new company to the store
    dispatch(addCompany(company));
    handleCloseDialog();
  };

  const handleUpdateCompany = (id, data) => {
    dispatch(updateCompanyData({ id, data }));
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Merger Modeling Dashboard
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/scenarios')}
            sx={{ mr: 2 }}
          >
            New Scenario
          </Button>
          {scenarios.length > 1 && (
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<CompareArrowsIcon />}
              onClick={() => navigate('/comparison')}
            >
              Compare Scenarios
            </Button>
          )}
        </Box>
      </Box>
      
      <DashboardSummary scenarios={scenarios} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
        <Typography variant="h5" component="h2">
          Company Profiles
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Company
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {companies.map(company => (
          <Grid item size={{xs:12, md:6}} key={company.id}>
            <CompanyCard company={company} onUpdateCompany={handleUpdateCompany} />
          </Grid>
        ))}
      </Grid>
      
      {scenarios.length > 0 ? (
        <>
          <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
            Recent Scenarios
          </Typography>
          
          <Grid container spacing={3}>
            {scenarios.slice(0, 3).map(scenario => (
              <Grid item size={{xs:12, md:4}} key={scenario.id}>
                <Card className="card">
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {scenario.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Created: {new Date(scenario.createdAt).toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack spacing={1}>
                    <Typography variant="body2">
                      {"Ownership:"} 
                    </Typography>
                    {companies.map(c => <Typography key={c.id} variant="body2">{scenario.ownership?.[c.id] > 0 ? `${c.name} (${scenario.ownership[c.id]}%) ` : ''}</Typography>)}
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/scenarios/${scenario.id}`)}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            No Scenarios Created Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get started by creating your first merger scenario
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/scenarios')}
          >
            Create First Scenario
          </Button>
        </Paper>
      )}
      
      {/* Dialog for creating a new company */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Company</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Company Name"
            fullWidth
            variant="outlined"
            value={newCompany.name}
            onChange={handleInputChange('name')}
            sx={{ mb: 3, mt: 1 }}
            required
          />
          <TextField
            margin="dense"
            label="Company ID"
            fullWidth
            variant="outlined"
            value={newCompany.id}
            onChange={handleInputChange('id')}
            helperText="Auto-generated from name. Used as internal identifier."
            sx={{ mb: 3 }}
            disabled
          />
          <TextField
            margin="dense"
            label="Cash on Hand"
            fullWidth
            variant="outlined"
            value={newCompany.cashOnHand}
            onChange={handleInputChange('cashOnHand')}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            type="number"
          />
          <TextField
            margin="dense"
            label="Annual Recurring Revenue"
            fullWidth
            variant="outlined"
            value={newCompany.arr}
            onChange={handleInputChange('arr')}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateCompany} 
            variant="contained" 
            color="primary"
            disabled={!newCompany.name}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
