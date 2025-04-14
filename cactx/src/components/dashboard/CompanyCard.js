import React, { useState, useRef, useEffect } from 'react';
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
  Grid,
  Button,
  Tooltip,
  Popover
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useDispatch } from 'react-redux';
import { updateCompanyName, updateCompanyColor } from '../../store/companiesSlice';
import { HexColorPicker } from 'react-colorful';
import { getCompanyColor } from '../../utils/colorUtils';

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
  const [editedName, setEditedName] = useState(name);
  const [editedCashOnHand, setEditedCashOnHand] = useState(cashOnHand);
  const [editedArr, setEditedArr] = useState(arr);
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const [selectedColor, setSelectedColor] = useState(company.color || getCompanyColor(id));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use company's custom color if available, otherwise use the utility
  const companyColor = company.color || getCompanyColor(id);
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      onUpdateCompany(id, { 
        cashOnHand: editedCashOnHand,
        arr: editedArr 
      });
      
      // Save company name change
      if (editedName !== name) {
        dispatch(updateCompanyName({ companyId: id, newName: editedName }));
      }
      
      // Save company color if changed
      if (selectedColor !== company.color) {
        dispatch(updateCompanyColor({ companyId: id, color: selectedColor }));
      }
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
  
  // Color picker handlers
  const handleColorPickerOpen = (event) => {
    setColorPickerAnchor(event.currentTarget);
  };
  
  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };
  
  const handleColorChange = (color) => {
    setSelectedColor(color);
    dispatch(updateCompanyColor({ companyId: id, color }));
  };
  
  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };
  
  return (
    <Card className="card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: `${companyColor}`, mr: 2, border: `2px solid ${companyColor}` }}>
            <BusinessIcon />
          </Avatar>
          
          {isEditing ? (
            <TextField
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              variant="standard"
              fullWidth
              autoFocus
            />
          ) : (
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              {name}
            </Typography>
          )}
          
          {isEditing && (
            <Tooltip title="Change company color">
              <IconButton 
                onClick={handleColorPickerOpen}
                sx={{ 
                  mr: 1,
                  bgcolor: selectedColor + '33', // Add transparency
                  '&:hover': { bgcolor: selectedColor + '55' } 
                }}
              >
                <ColorLensIcon sx={{ color: selectedColor }} />
              </IconButton>
            </Tooltip>
          )}
          
          <IconButton onClick={handleEditToggle} color="primary">
            {isEditing ? <CheckIcon /> : <EditIcon />}
          </IconButton>
          
          <Popover
            open={Boolean(colorPickerAnchor)}
            anchorEl={colorPickerAnchor}
            onClose={handleColorPickerClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box sx={{ p: 1 }}>
              <HexColorPicker color={selectedColor} onChange={handleColorChange} />
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="body2" gutterBottom>
                  {selectedColor}
                </Typography>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={handleColorPickerClose}
                  sx={{ bgcolor: selectedColor, '&:hover': { bgcolor: selectedColor + 'dd' } }}
                >
                  Apply
                </Button>
              </Box>
            </Box>
          </Popover>
        </Box>
        
        <Typography variant="h6" component="div" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Financial Overview
          <IconButton size="small" onClick={handleEditToggle} color={isEditing ? "primary" : "default"}>
            {isEditing ? <CheckIcon /> : <EditIcon />}
          </IconButton>
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item size={{xs:12, md:6}}>
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
                <Typography variant="h5" sx={{ fontWeight: 'medium', color: companyColor }}>
                  {formatCurrency(cashOnHand)}
                </Typography>
              )}
            </Grid>
            
            <Grid item size={{xs:12, md:6}}>
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
                <Typography variant="h5" sx={{ fontWeight: 'medium', color: companyColor }}>
                  {formatCurrency(arr)}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="primary"
            size="small"
            onClick={() => navigate(`/investors/${id}`)}
          >
            Manage Investors
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
};

export default CompanyCard;
