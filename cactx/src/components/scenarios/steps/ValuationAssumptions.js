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
import { useSelector } from 'react-redux';
import { selectCompanies } from '../../../store/companiesSlice';
import { getCompanyColor } from '../../../utils/colorUtils';

const ValuationAssumptions = ({ data, onChange }) => {
  const companies = useSelector(selectCompanies);
  // Generic handler for company valuation change
  const handleValuationChange = (companyId, e) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10);
    if (!isNaN(value) && value >= 0) {
      // Update this company's valuation
      const valuationKey = `${companyId}`;
      onChange(valuationKey, value);
      
      // Clear other companies' valuations when this one is set
      if (value > 0) {
        companies.forEach(otherCompany => {
          if (otherCompany.id !== companyId) {
            onChange(`${otherCompany.id}`, 0);
          }
        });
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
    const companyWithValuation = companies.find(company => {
      const valuationKey = `${company.id}`;
      return data[valuationKey] > 0;
    });
    
    if (companyWithValuation) {
      return `${companyWithValuation.name}'s valuation is set manually. Other company valuations will be calculated based on ownership percentages.`;
    } else {
      return "Enter a valuation for one company. The valuations of other companies will be calculated automatically.";
    }
  };
  
  // Get valuation for a specific company
  const getCompanyValuation = (companyId) => {
    const valuationKey = `${companyId}`;
    return data[valuationKey] || 0;
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
        {companies.map((company, index) => {
          const companyValuation = getCompanyValuation(company.id);
          const isSelected = companyValuation > 0;
          // Get consistent color for this company
          const companyColor = getCompanyColor(company.id);
          
          return (
            <Grid item size={{xs:12, md:6}} key={company.id}>
              <Paper sx={{ 
                p: 3, 
                border: isSelected ? `2px solid ${companyColor}` : 'none',
                height: '100%'
              }}>
                <Typography variant="subtitle1" gutterBottom>
                  {company.name} Valuation
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Set the valuation for {company.name}
                </Typography>
                
                <TextField
                  fullWidth
                  value={companyValuation}
                  onChange={(e) => handleValuationChange(company.id, e)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  placeholder={`Enter ${company.name} valuation`}
                  sx={{ mt: 2 }}
                />
                
                {companyValuation > 0 && (
                  <FormHelperText sx={{ color: companyColor, mt: 1 }}>
                    {company.name} valuation set to {formatCurrency(companyValuation)}
                  </FormHelperText>
                )}
              </Paper>
            </Grid>
          );
        })}
        
        <Grid item size={12}>
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
