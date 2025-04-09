import React from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  Grid,
  Paper,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';
import OwnershipChart from '../../visualizations/OwnershipChart';

const OwnershipStructure = ({ data, onChange, companies }) => {
  
  // Handler for adjusting values to ensure they sum to 100%
  const adjustValues = (field, newValue) => {
    // Get current values
    const current = { ...data };
    
    // Update the changed field
    current[field] = newValue;
    
    // Calculate how much we need to adjust the other fields
    const total = Object.values(current).reduce((sum, val) => sum + val, 0);
    const excess = total - 100;
    
    if (excess !== 0) {
      // Find the other two fields
      const otherFields = Object.keys(current).filter(key => key !== field);
      
      // First, try to adjust only the last field (the one we haven't touched)
      // Determine which field to adjust (last field that wasn't changed)
      const fieldOrder = ['catx', 'cactus'];
      const lastField = fieldOrder.filter(f => f !== field).pop();
      
      // Check if last field has room for adjustment
      if (current[lastField] - excess >= 0 || excess < 0) {
        // Last field can accommodate the change
        current[lastField] = Math.max(0, current[lastField] - excess);
        current[lastField] = Math.round(current[lastField]);
      } else {
        // Last field would go negative, so we need to distribute among other fields
        // Sort other fields by size (descending)
        const sortedFields = otherFields.sort((a, b) => current[b] - current[a]);
        
        // First, take as much as possible from the last field
        const remainingExcess = excess - current[lastField];
        current[lastField] = 0;
        
        // Then, take the rest from the middle field
        const middleField = sortedFields[0];
        current[middleField] = Math.max(0, current[middleField] - remainingExcess);
        current[middleField] = Math.round(current[middleField]);
      }
      
      // Final adjustment to ensure sum is exactly 100
      const finalTotal = Object.values(current).reduce((sum, val) => sum + val, 0);
      if (finalTotal !== 100) {
        // Add/subtract the difference from the field we're adjusting
        const adjustField = current[lastField] > 0 ? lastField : 
                           otherFields.find(f => current[f] > 0) || field;
        current[adjustField] += (100 - finalTotal);
      }
    }
    
    // Update all fields in the state
    Object.keys(current).forEach(key => {
      onChange(key, current[key]);
    });
  };
  
  // Change handlers for each owner
  const handleChange = (companyId, newValue) => {
    adjustValues(companyId, newValue);
  };
  
  const handleInputChange = (id, event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    if (!isNaN(value)) {
      adjustValues(id, value);
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ownership Structure
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define the ownership percentages for each company in the merged entity
      </Typography>
      
      <Grid container spacing={3}>
        {companies.map(company => (
          <Grid item xs={12} md={4} key={company.id}>
            <Paper sx={{ p: 3, bgcolor: 'secondary.light', color: 'white' }}>
              <Typography variant="h6" gutterBottom>
                {company.name} Ownership
              </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <TextField
                value={data[company.id]}
                onChange={(e) => handleInputChange(company.id, e)}
                variant="outlined"
                size="small"
                sx={{ 
                  width: '100px', 
                  input: { color: 'white', textAlign: 'center' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' },
                  }
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end" sx={{ color: 'white' }}>%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 100,
                  type: 'number',
                  'aria-labelledby': 'catx-ownership-input',
                }}
              />
            </Box>
            <Slider
              value={data[company.id] || 0}
              onChange={(event, newValue) => handleChange(company.id, newValue)}
              aria-labelledby="catx-ownership-slider"
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={100}
              sx={{
                color: 'white',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            />
          </Paper>
        </Grid>
        ))}
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ownership Distribution
            </Typography>
            <Divider sx={{ my: 2 }} />
            <OwnershipChart ownership={data} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This visualization shows the relative ownership percentage between CatX and Cactus in the merged company.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnershipStructure;
