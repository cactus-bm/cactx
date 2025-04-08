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

const OwnershipStructure = ({ data, onChange }) => {
  // Ensure the initial values are within bounds
  const { catx = 0, cactus = 0, ben = 0 } = data;
  
  // Handler for adjusting all three values to ensure they sum to 100%
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
      
      // Calculate proportions of the other fields
      const otherTotal = otherFields.reduce((sum, key) => sum + current[key], 0);
      
      if (otherTotal > 0) {
        // Adjust the other fields proportionally
        otherFields.forEach(key => {
          const proportion = current[key] / otherTotal;
          current[key] = Math.max(0, current[key] - excess * proportion);
          // Round to integers
          current[key] = Math.round(current[key]);
        });
        
        // Final adjustment to ensure sum is exactly 100
        const finalTotal = Object.values(current).reduce((sum, val) => sum + val, 0);
        if (finalTotal !== 100) {
          // Add/subtract the difference from the largest other field
          const largestField = otherFields.reduce((a, b) => current[a] > current[b] ? a : b);
          current[largestField] += (100 - finalTotal);
        }
      } else {
        // If other fields are already 0, adjust the current field
        current[field] = 100;
      }
    }
    
    // Update all fields in the state
    Object.keys(current).forEach(key => {
      onChange(key, current[key]);
    });
  };
  
  // Change handlers for each owner
  const handleCatXChange = (event, newValue) => {
    adjustValues('catx', newValue);
  };
  
  const handleCactusChange = (event, newValue) => {
    adjustValues('cactus', newValue);
  };
  
  const handleBenChange = (event, newValue) => {
    adjustValues('ben', newValue);
  };
  
  const handleCatXInputChange = (event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    if (!isNaN(value)) {
      adjustValues('catx', value);
    }
  };
  
  const handleCactusInputChange = (event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    if (!isNaN(value)) {
      adjustValues('cactus', value);
    }
  };
  
  const handleBenInputChange = (event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    if (!isNaN(value)) {
      adjustValues('ben', value);
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
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: 'secondary.light', color: 'white' }}>
            <Typography variant="h6" gutterBottom>
              CatX Ownership
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <TextField
                value={data.catx}
                onChange={handleCatXInputChange}
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
              value={data.catx}
              onChange={handleCatXChange}
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
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h6" gutterBottom>
              Cactus Ownership
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <TextField
                value={data.cactus}
                onChange={handleCactusInputChange}
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
                  'aria-labelledby': 'cactus-ownership-input',
                }}
              />
            </Box>
            <Slider
              value={data.cactus}
              onChange={handleCactusChange}
              aria-labelledby="cactus-ownership-slider"
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
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: 'warning.light', color: 'white' }}>
            <Typography variant="h6" gutterBottom>
              Ben Earnout
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <TextField
                value={data.ben}
                onChange={handleBenInputChange}
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
                  'aria-labelledby': 'ben-ownership-input',
                }}
              />
            </Box>
            <Slider
              value={data.ben}
              onChange={handleBenChange}
              aria-labelledby="ben-ownership-slider"
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
