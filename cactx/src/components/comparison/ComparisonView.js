import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  Card,
  CardContent,
  Divider,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { selectScenarios } from '../../store/scenariosSlice';
import { selectCompanies } from '../../store/companiesSlice';

// Format currency values
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const ComparisonView = () => {
  const navigate = useNavigate();
  const scenarios = useSelector(selectScenarios);
  const companies = useSelector(selectCompanies);
  
  const [selectedScenarios, setSelectedScenarios] = useState([null, null]);
  
  // Handle scenario selection changes
  const handleScenarioChange = (index, scenarioId) => {
    const newSelectedScenarios = [...selectedScenarios];
    newSelectedScenarios[index] = scenarioId;
    setSelectedScenarios(newSelectedScenarios);
  };
  
  // Get full scenario objects
  const scenarioObjects = selectedScenarios.map(id => 
    id ? scenarios.find(s => s.id === id) : null
  );
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Compare Scenarios
        </Typography>
      </Box>
      
      {scenarios.length < 2 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Not Enough Scenarios
          </Typography>
          <Typography variant="body1" paragraph>
            You need at least two scenarios to use the comparison feature.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/scenarios')}
          >
            Create Another Scenario
          </Button>
        </Paper>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select Scenarios to Compare
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>First Scenario</InputLabel>
                  <Select
                    value={selectedScenarios[0] || ''}
                    label="First Scenario"
                    onChange={(e) => handleScenarioChange(0, e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select a scenario</em>
                    </MenuItem>
                    {scenarios.map((scenario) => (
                      <MenuItem 
                        key={scenario.id} 
                        value={scenario.id}
                        disabled={scenario.id === selectedScenarios[1]}
                      >
                        {scenario.basicInfo.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Second Scenario</InputLabel>
                  <Select
                    value={selectedScenarios[1] || ''}
                    label="Second Scenario"
                    onChange={(e) => handleScenarioChange(1, e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select a scenario</em>
                    </MenuItem>
                    {scenarios.map((scenario) => (
                      <MenuItem 
                        key={scenario.id} 
                        value={scenario.id}
                        disabled={scenario.id === selectedScenarios[0]}
                      >
                        {scenario.basicInfo.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          
          {scenarioObjects[0] && scenarioObjects[1] && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CompareArrowsIcon sx={{ mr: 2 }} />
                <Typography variant="h5" component="h2">
                  Comparison Results
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                {/* Basic Info Comparison */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Basic Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2">Feature</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="primary.main">
                            {scenarioObjects[0].name}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="secondary.main">
                            {scenarioObjects[1].name}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Ownership (CatX)</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>{scenarioObjects[0].ownership?.catx || 0}%</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>{scenarioObjects[1].ownership?.catx || 0}%</Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Ownership (Cactus)</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>{scenarioObjects[0].ownership?.cactus || 0}%</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>{scenarioObjects[1].ownership?.cactus || 0}%</Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Cost Synergies</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].financialAssumptions?.costSynergies || 0}%
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].financialAssumptions?.costSynergies || 0}%
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Revenue Growth</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].financialAssumptions?.revenueGrowth || 0}%
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].financialAssumptions?.revenueGrowth || 0}%
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Workforce Reduction</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].operationalAssumptions?.workforceReduction || 0}%
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].operationalAssumptions?.workforceReduction || 0}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Financial Results Comparison */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Financial Results
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2">Metric</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="primary.main">
                            {scenarioObjects[0].name}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="secondary.main">
                            {scenarioObjects[1].name}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Combined Revenue</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].results ? 
                              formatCurrency(scenarioObjects[0].results.combinedFinancials.revenue) : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].results ? 
                              formatCurrency(scenarioObjects[1].results.combinedFinancials.revenue) : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Combined Expenses</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].results ? 
                              formatCurrency(scenarioObjects[0].results.combinedFinancials.expenses) : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].results ? 
                              formatCurrency(scenarioObjects[1].results.combinedFinancials.expenses) : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Profit</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].results ? 
                              formatCurrency(scenarioObjects[0].results.combinedFinancials.profit) : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].results ? 
                              formatCurrency(scenarioObjects[1].results.combinedFinancials.profit) : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Profit Margin</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].results ? 
                              `${scenarioObjects[0].results.combinedFinancials.profitMargin.toFixed(1)}%` : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].results ? 
                              `${scenarioObjects[1].results.combinedFinancials.profitMargin.toFixed(1)}%` : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Valuation</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].results ? 
                              formatCurrency(scenarioObjects[0].results.valuation.weightedValue) : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].results ? 
                              formatCurrency(scenarioObjects[1].results.valuation.weightedValue) : 
                              'N/A'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Operational Results Comparison */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Operational Results
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2">Metric</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="primary.main">
                            {scenarioObjects[0].name}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="subtitle2" color="secondary.main">
                            {scenarioObjects[1].name}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Employees</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].results ? 
                              scenarioObjects[0].results.operationalMetrics.employees.toLocaleString() : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].results ? 
                              scenarioObjects[1].results.operationalMetrics.employees.toLocaleString() : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Offices</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].results ? 
                              scenarioObjects[0].results.operationalMetrics.offices : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].results ? 
                              scenarioObjects[1].results.operationalMetrics.offices : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={4}>
                          <Typography>Market Share</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[0].results ? 
                              `${scenarioObjects[0].results.operationalMetrics.marketShare}%` : 
                              'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>
                            {scenarioObjects[1].results ? 
                              `${scenarioObjects[1].results.operationalMetrics.marketShare}%` : 
                              'N/A'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ComparisonView;
