import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography,
  Divider,
  Box,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Grid
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch } from 'react-redux';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const CompanyCard = ({ company, onUpdateCompany }) => {
  const { id, name, cashOnHand, arr, metrics } = company;
  const [isEditing, setIsEditing] = useState(false);
  const [editedCashOnHand, setEditedCashOnHand] = useState(cashOnHand);
  const [editedArr, setEditedArr] = useState(arr);
  
  // Determine styling based on company
  const isGreen = id === 'cactus';
  const primaryColor = isGreen ? '#2e7d32' : '#1976d2';
  const avatarBgColor = isGreen ? 'primary.main' : 'secondary.main';
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      onUpdateCompany(id, { 
        cashOnHand: editedCashOnHand,
        arr: editedArr 
      });
    }
    setIsEditing(!isEditing);
  };
  
  const handleCashOnHandChange = (e) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(value)) {
      setEditedCashOnHand(value);
    }
  };
  
  const handleArrChange = (e) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(value)) {
      setEditedArr(value);
    }
  };
  
  return (
    <Card className="card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ bgcolor: avatarBgColor, mr: 2 }}
          >
            <BusinessIcon />
          </Avatar>
          <Typography variant="h5" component="div" sx={{ color: primaryColor, fontWeight: 'bold' }}>
            {name}
          </Typography>
        </Box>
        
        <Typography variant="h6" component="div" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Financial Overview
          <IconButton size="small" onClick={handleEditToggle} color={isEditing ? "primary" : "default"}>
            {isEditing ? <CheckIcon /> : <EditIcon />}
          </IconButton>
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Cash on Hand
              </Typography>
              {isEditing ? (
                <TextField
                  value={editedCashOnHand}
                  onChange={handleCashOnHandChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 'medium', color: primaryColor }}>
                  {formatCurrency(cashOnHand)}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Annual Recurring Revenue
              </Typography>
              {isEditing ? (
                <TextField
                  value={editedArr}
                  onChange={handleArrChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 'medium', color: primaryColor }}>
                  {formatCurrency(arr)}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
        

      </CardContent>
    </Card>
  );
};

export default CompanyCard;
