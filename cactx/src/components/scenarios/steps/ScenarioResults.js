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
      
      <Grid container spacing={3}>
        {/* Financial Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Financial Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Combined Revenue
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(results.combinedFinancials.revenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Baseline: {formatCurrency(catx.financials.revenue + cactus.financials.revenue)}
                    {' '} | Growth: {scenario.financialAssumptions.revenueGrowth}%
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Combined Expenses
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(results.combinedFinancials.expenses)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Baseline: {formatCurrency(catx.financials.expenses + cactus.financials.expenses)}
                    {' '} | Synergies: {scenario.financialAssumptions.costSynergies}%
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Profit
                  </Typography>
                  <Typography 
                    variant="h4"
                    color={results.combinedFinancials.profit >= 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(results.combinedFinancials.profit)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Baseline: {formatCurrency((catx.financials.revenue - catx.financials.expenses) + 
                    (cactus.financials.revenue - cactus.financials.expenses))}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Profit Margin
                  </Typography>
                  <Typography 
                    variant="h4"
                    color={results.combinedFinancials.profitMargin >= 0 ? 'success.main' : 'error.main'}
                  >
                    {results.combinedFinancials.profitMargin.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CatX: {((catx.financials.revenue - catx.financials.expenses) / catx.financials.revenue * 100).toFixed(1)}%
                    {' '} | Cactus: {((cactus.financials.revenue - cactus.financials.expenses) / cactus.financials.revenue * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Operational Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Operational Metrics
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Employees
                </Typography>
                <Typography variant="h5">
                  {results.operationalMetrics.employees.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reduction: {scenario.operationalAssumptions.workforceReduction}%
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Offices
                </Typography>
                <Typography variant="h5">
                  {results.operationalMetrics.offices}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reduction: {scenario.operationalAssumptions.officeConsolidation}%
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Combined Market Share
                  </Typography>
                  <Typography variant="h5">
                    {results.operationalMetrics.marketShare}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CatX: {catx.metrics.marketShare}% + Cactus: {cactus.metrics.marketShare}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Valuation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Valuation
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Weighted Valuation
              </Typography>
              <Typography variant="h4">
                {formatCurrency(results.valuation.weightedValue)}
              </Typography>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Valuation Methods
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Revenue-Based
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(results.valuation.revenueBasedValue)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Profit-Based
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(results.valuation.profitBasedValue)}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Asset-Based
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(results.valuation.assetBasedValue)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* 5-Year Projections */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              5-Year Financial Projections
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Based on annual revenue growth of {scenario.financialAssumptions.annualRevenueGrowth}% 
              and expense growth of {scenario.financialAssumptions.annualExpenseGrowth}%
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <TableContainer>
              <Table aria-label="financial projections table">
                <TableHead>
                  <TableRow>
                    <TableCell>Year</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">Expenses</TableCell>
                    <TableCell align="right">Profit</TableCell>
                    <TableCell align="right">Margin</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.projections.map((year) => (
                    <TableRow key={year.year}>
                      <TableCell component="th" scope="row">
                        Year {year.year}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(year.revenue)}</TableCell>
                      <TableCell align="right">{formatCurrency(year.expenses)}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: year.profit >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {formatCurrency(year.profit)}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: year.profitMargin >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}
                      >
                        {year.profitMargin.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScenarioResults;
