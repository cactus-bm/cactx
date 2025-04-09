import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { selectCompanyById, updateCompanyData } from '../../store/companiesSlice';
import EquityDistributionViewer from './EquityDistributionViewer';

// Format currency values
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

// Format percentage values
const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`;
};

const InvestorManagement = ({ companyId }) => {
  const dispatch = useDispatch();
  const company = useSelector((state) => selectCompanyById(state, companyId));
  
  const [openDialog, setOpenDialog] = useState(false);
  const [investorType, setInvestorType] = useState('equity'); // 'equity', 'safe', or 'employees'
  const [currentInvestor, setCurrentInvestor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    percentage: 0,
    amount: 0,
    cap: 0,
    allocated: 0,
    discount: 0
  });
  
  // Handle opening the dialog for adding/editing investors
  const handleOpenDialog = (type, investor = null) => {
    setInvestorType(type);
    
    if (investor) {
      // Editing existing investor
      setCurrentInvestor(investor);
      setFormData({
        name: investor.name,
        percentage: type === 'equity' ? investor.percentage : 0,
        amount: type === 'safe' ? investor.amount : 0,
        cap: type === 'safe' && investor.cap ? investor.cap : 0,
        allocated: type === 'employees' ? investor.allocated : 0,
        discount: type === 'safe' && investor.discount ? investor.discount : 0
      });
    } else {
      // Adding new investor
      setCurrentInvestor(null);
      setFormData({
        name: '',
        percentage: 0,
        amount: 0,
        cap: 0,
        allocated: 0,
        discount: 0
      });
    }
    
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name === 'percentage' || name === 'discount') {
      // Convert percentage to decimal (0-1)
      processedValue = parseFloat(value) / 100;
    } else if (name === 'amount' || name === 'cap' || name === 'allocated') {
      // Convert to number
      processedValue = parseFloat(value);
    }
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };
  
  const handleSaveInvestor = () => {
    // Create a DEEP copy of the current investors object with all arrays
    const updatedInvestors = {
      equity: [...company.investors.equity],
      safe: [...company.investors.safe],
      employees: [...company.investors.employees]
    };
    
    if (currentInvestor) {
      // Update existing investor
      const index = updatedInvestors[investorType].findIndex(inv => inv.name === currentInvestor.name);
      
      if (index !== -1) {
        if (investorType === 'equity') {
          // Create a new array with the updated item
          updatedInvestors.equity = updatedInvestors.equity.map((item, idx) => 
            idx === index ? {
              name: formData.name,
              percentage: formData.percentage
            } : item
          );
        } else if (investorType === 'safe') {
          // Create a new array with the updated item
          updatedInvestors.safe = updatedInvestors.safe.map((item, idx) => 
            idx === index ? {
              name: formData.name,
              amount: formData.amount,
              cap: formData.cap,
              discount: formData.discount
            } : item
          );
        } else if (investorType === 'employees') {
          // Create a new array with the updated item
          updatedInvestors.employees = updatedInvestors.employees.map((item, idx) => 
            idx === index ? {
              name: formData.name,
              allocated: formData.allocated 
            } : item
          );
        }
      }
    } else {
      // Add new investor
      if (investorType === 'equity') {
        updatedInvestors.equity = [
          ...updatedInvestors.equity,
          {
            name: formData.name,
            percentage: formData.percentage
          }
        ];
      } else if (investorType === 'safe') {
        updatedInvestors.safe = [
          ...updatedInvestors.safe,
          {
            name: formData.name,
            amount: formData.amount,
            cap: formData.cap,
            discount: formData.discount
          }
        ];
      } else if (investorType === 'employees') {
        updatedInvestors.employees = [
          ...updatedInvestors.employees,
          {
            name: formData.name,
            allocated: formData.allocated
          }
        ];
      }
    }
    
    // Update state in Redux
    dispatch(updateCompanyData({
      id: companyId,
      data: {
        investors: updatedInvestors
      }
    }));
    
    handleCloseDialog();
  };
  
  const handleDeleteInvestor = (type, investorName) => {
    // Create a DEEP copy of the current investors object with all arrays
    const updatedInvestors = {
      equity: [...company.investors.equity],
      safe: [...company.investors.safe],
      employees: [...company.investors.employees]
    };
    
    // Remove investor from the list using a new array
    updatedInvestors[type] = updatedInvestors[type].filter(investor => investor.name !== investorName);
    
    // Update state in Redux
    dispatch(updateCompanyData({
      id: companyId,
      data: {
        investors: updatedInvestors
      }
    }));
  };
  
  // Calculate total equity percentage
  const totalEquityPercentage = company?.investors?.equity?.reduce(
    (total, investor) => total + investor.percentage, 
    0
  ) || 0;

  const totalEmployeeAllocated = company?.investors?.employees?.reduce(
    (total, investor) => total + investor.allocated, 
    0
  ) || 0;
  
  // Calculate total employee equity percentage
  const totalEmployeePercentage = (1 - totalEquityPercentage)   
  
  // Calculate total SAFE investment
  const totalSafeAmount = company?.investors?.safe?.reduce(
    (total, investor) => total + investor.amount, 
    0
  ) || 0;
  
  // Calculate allocated employee equity (from option pool)
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {company.name} Investor Management
      </Typography>
      
      <Grid container spacing={4}>
        {/* Equity Investors */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Equity Holders
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('equity')}
              >
                Add Equity Holder
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {company?.investors?.equity?.map((investor) => (
                    <TableRow key={investor.name}>
                      <TableCell>{investor.name}</TableCell>
                      <TableCell align="right">{formatPercentage(investor.percentage)}</TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          startIcon={<EditIcon />} 
                          onClick={() => handleOpenDialog('equity', investor)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<DeleteIcon />} 
                          onClick={() => handleDeleteInvestor('equity', investor.name)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1">
              <strong>Total Equity:</strong> {formatPercentage(totalEquityPercentage)}
            </Typography>
          </Paper>
        </Grid>
        
        {/* SAFE Investors */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                SAFE Holders
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('safe')}
              >
                Add SAFE Holder
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Investment Amount</TableCell>
                    <TableCell align="right">Valuation Discount</TableCell>
                    <TableCell align="right">Valuation Cap</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {company?.investors?.safe?.map((investor) => (
                    <TableRow key={investor.name}>
                      <TableCell>{investor.name}</TableCell>
                      <TableCell align="right">{formatCurrency(investor.amount)}</TableCell>
                      <TableCell align="right">{investor.discount ? formatPercentage(investor.discount) : 'N/A'}</TableCell>
                      <TableCell align="right">{investor.cap ? formatCurrency(investor.cap) : 'N/A'}</TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          startIcon={<EditIcon />} 
                          onClick={() => handleOpenDialog('safe', investor)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<DeleteIcon />} 
                          onClick={() => handleDeleteInvestor('safe', investor.name)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1">
              <strong>Total SAFE Investment:</strong> {formatCurrency(totalSafeAmount)}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Employee Investors */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Employees
              </Typography>
              <Button 
                variant="contained" 
                color="info" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('employees')}
              >
                Add Employee
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Allocated</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {company?.investors?.employees?.map((investor) => {
                    return(
                    <TableRow key={investor.name}>
                      <TableCell>{investor.name}</TableCell>
                      <TableCell align="right">
                        {investor.allocated}
                      </TableCell>
                      <TableCell align="right">{formatPercentage(investor.allocated / totalEmployeeAllocated * totalEmployeePercentage)}</TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          startIcon={<EditIcon />} 
                          onClick={() => handleOpenDialog('employees', investor)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<DeleteIcon />} 
                          onClick={() => handleDeleteInvestor('employees', investor.name)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
)})}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1">
              <strong>Total Employee Equity:</strong> {formatPercentage(totalEmployeePercentage)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <EquityDistributionViewer companyId={companyId} />
        </Grid>
      </Grid>
      
      {/* Add/Edit Investor Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentInvestor 
            ? `Edit ${(() => {
              if (investorType === 'equity') return 'Equity';
              if (investorType === 'safe') return 'SAFE';
              return 'Employee';
            })()}` 
            : `Add New ${(() => {
              if (investorType === 'equity') return 'Equity';
              if (investorType === 'safe') return 'SAFE';
              return 'Employee';
            })()}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Investor Type</InputLabel>
                  <Select
                    value={investorType}
                    label="Investor Type"
                    onChange={(e) => setInvestorType(e.target.value)}
                  >
                    <MenuItem value="equity">Equity Holder</MenuItem>
                    <MenuItem value="safe">SAFE Holder</MenuItem>
                    <MenuItem value="employees">Employee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Investor Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {investorType === 'employees' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Allocated Units"
                    name="allocated"
                    type="number"
                    value={formData.allocated}
                    onChange={handleInputChange}
                    required
                    inputProps={{ 
                      min: 0, 
                    }}
                    helperText={`This is a relative allocation.`}
                  />
                </Grid>
              )}
              
              {investorType === 'equity' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ownership Percentage"
                    name="percentage"
                    type="number"
                    InputProps={{
                      endAdornment: '%'
                    }}
                    value={formData.percentage * 100}
                    onChange={handleInputChange}
                    required
                    inputProps={{ 
                      min: 0, 
                      max: 100, 
                      step: 0.1 
                    }}
                  />
                </Grid>
              )} 

              {investorType === 'safe' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Investment Amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Valuation Discount"
                        name="discount"
                        type="number"
                        InputProps={{
                          endAdornment: '%'
                        }}
                        value={formData.discount * 100}
                        onChange={handleInputChange}
                        inputProps={{ 
                          min: 0, 
                          max: 100, 
                          step: 0.1 
                        }}
                        helperText="The discount applied to the valuation before the cap is applied."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Valuation Cap"
                        name="cap"
                        value={formData.cap}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        helperText="The maximum company valuation at which the SAFE converts to equity."
                      />
                    </Grid>
                  </>
                )   
}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveInvestor}
            disabled={
              !formData.name || 
              (investorType === 'equity' && (formData.percentage <= 0 || formData.percentage > 1)) ||
              (investorType === 'safe' && formData.amount <= 0) ||
              (investorType === 'employees' && (formData.allocated <= 0))
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvestorManagement;
