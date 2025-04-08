import React from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Paper,
  TextField,
  InputAdornment,
  FormHelperText
} from '@mui/material';

const ValuationAssumptions = ({ data, onChange }) => {
  // Handler for CatX valuation change
  const handleCatXValuationChange = (e) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10);
    if (!isNaN(value) && value >= 0) {
      // Update CatX valuation
      onChange('catxValuation', value);
      
      // Clear Cactus valuation when CatX is set
      if (value > 0) {
        onChange('cactusValuation', 0);
      }
    }
  };
  
  // Handler for Cactus valuation change
  const handleCactusValuationChange = (e) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10);
    if (!isNaN(value) && value >= 0) {
      // Update Cactus valuation
      onChange('cactusValuation', value);
      
      // Clear CatX valuation when Cactus is set
      if (value > 0) {
        onChange('catxValuation', 0);
      }
    }
  };

  // Format number as currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Get description text based on which valuation is set
  const getDescriptionText = () => {
    if (data.catxValuation > 0) {
      return "CatX's valuation is set manually. The Cactus valuation will be calculated based on ownership percentages and financial data.";
    } else if (data.cactusValuation > 0) {
      return "Cactus's valuation is set manually. The CatX valuation will be calculated based on ownership percentages and financial data.";
    } else {
      return "Enter a valuation for either company. The valuation of the other company will be calculated automatically.";
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Valuation Assumptions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set the valuation for one of the companies. You can only set the valuation for one company at a time.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, border: data.catxValuation > 0 ? '2px solid #3f51b5' : 'none' }}>
            <Typography variant="subtitle1" gutterBottom>
              CatX Valuation
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Set the valuation for CatX
            </Typography>
            
            <TextField
              fullWidth
              value={data.catxValuation}
              onChange={handleCatXValuationChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              placeholder="Enter CatX valuation"
              sx={{ mt: 2 }}
            />
            
            {data.catxValuation > 0 && (
              <FormHelperText sx={{ color: 'primary.main', mt: 1 }}>
                CatX valuation set to {formatCurrency(data.catxValuation)}
              </FormHelperText>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, border: data.cactusValuation > 0 ? '2px solid #4caf50' : 'none' }}>
            <Typography variant="subtitle1" gutterBottom>
              Cactus Valuation
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Set the valuation for Cactus
            </Typography>
            
            <TextField
              fullWidth
              value={data.cactusValuation}
              onChange={handleCactusValuationChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              placeholder="Enter Cactus valuation"
              sx={{ mt: 2 }}
            />
            
            {data.cactusValuation > 0 && (
              <FormHelperText sx={{ color: 'primary.main', mt: 1 }}>
                Cactus valuation set to {formatCurrency(data.cactusValuation)}
              </FormHelperText>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'info.light', color: 'white' }}>
            <Typography variant="subtitle1" gutterBottom>
              Valuation Method
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {getDescriptionText()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ValuationAssumptions;
