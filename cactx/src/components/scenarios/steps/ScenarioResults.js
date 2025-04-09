import React from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import OwnershipChart from '../../visualizations/OwnershipChart';

// Format currency values
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const ScenarioResults = ({ scenario, companies }) => {
  const catx = companies.find(c => c.id === 'catx');
  const cactus = companies.find(c => c.id === 'cactus');
  
  // Get results from scenario
  const { results } = scenario;
  
  if (!results) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Results Unavailable
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There was a problem calculating the results for this scenario. 
          Please check your inputs and try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Merger Results
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review the projected outcomes of this merger scenario
      </Typography>
      
        {/* Valuation */}
        <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Merger Valuation
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Valuation
              </Typography>
              <Typography variant="h4">
                {formatCurrency(results.valuation.merger.valuation)}
              </Typography>
              <Divider sx={{ my: 1 }} />
              
              {/* Individual Company Valuations */}
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                Individual Valuations
              </Typography>
              
              <Grid container spacing={2}>
                {companies.map(c => (
                <Grid item xs={6} key={c.id}>
                  <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                    {c.name}:
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(results.valuation[c.id]?.valuation || 0)}
                  </Typography>
                </Grid>
                ))}
              </Grid>
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="body2" color="text.secondary">
                Cash on Hand: {formatCurrency(results.valuation.cash.valuation)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ownership Structure
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              {companies.map(c => {
                return (
                <Grid item xs={4} key={c.id}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {c.name}
                  </Typography>
                  <Typography variant="h5" color={c.id === 'catx' ? 'secondary.main' : 'primary.main'}>
                    {scenario.ownership[c.id]}%
                  </Typography>
                </Grid>
              )})} 
              
            </Grid>
            
            <Box sx={{ mt: 3 }}>
              <OwnershipChart ownership={scenario.ownership} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScenarioResults;
