import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import InvestorDistributionList from './InvestorDistributionList';

/**
 * Component for viewing equity distribution based on a specified valuation
 */
const EquityDistributionViewer = ({ companyId }) => {
  const [valuation, setValuation] = useState(10000000); // Default $10M valuation
  const companies = useSelector(state => state.companies.companies);
  const company = companies.find(c => c.id === companyId);
  
  const handleValuationChange = (e) => {
    const value = parseFloat(e.target.value);
    setValuation(value > 0 ? value : 0);
  };

  if (!company) {
    return (
      <Typography variant="body1" color="text.secondary">
        Company not found.
      </Typography>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Equity Distribution
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Valuation"
              type="number"
              value={valuation}
              onChange={handleValuationChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Enter a valuation to see how equity would be distributed"
              margin="normal"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        {valuation > 0 && (
          <InvestorDistributionList 
            investors={company.investors} 
            valuation={valuation}
            title={`${company.name} Equity Distribution`}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EquityDistributionViewer;
