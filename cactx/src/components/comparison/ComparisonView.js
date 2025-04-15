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
import ScenarioCompanies from '../scenarios/ScenarioCompanies';
import ScenarioCombined from '../scenarios/ScenarioCombined';
import ShareholderComparisonChart from '../visualizations/ShareholderComparisonChart';

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
              <Grid item size={{xs:12, md:6}}>
                <FormControl fullWidth size="medium">
                  <InputLabel>First Scenario</InputLabel>
                  <Select
                    value={selectedScenarios[0] || ''}
                    sx={{ minWidth:"300px" }}
                    label="First Scenario"
                    onChange={(e) => handleScenarioChange(0, e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300
                        }
                      }
                    }}
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
              
              <Grid item size={{xs:12, md:6}}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Second Scenario</InputLabel>
                  <Select
                    value={selectedScenarios[1] || ''}
                    sx={{ minWidth:"300px" }}
                    label="Second Scenario"
                    onChange={(e) => handleScenarioChange(1, e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300
                        }
                      }
                    }}
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
              
              {/* Shareholder Comparison Chart */}
              <ShareholderComparisonChart scenarios={scenarioObjects} />
              <Grid container spacing={3} sx={{ width: '100%' }}>
                <Grid item size={{xs:12, lg:6}}>
                  <ScenarioCompanies
                    scenario={scenarioObjects[0]}
                  />
                </Grid>
                <Grid item size={{xs:12, lg:6}}>
                  <ScenarioCompanies
                    scenario={scenarioObjects[1]}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ width: '100%' }}>
                <Grid item size={{xs:12, lg:6}}>
                  <ScenarioCombined
                    scenario={scenarioObjects[0]}
                  />
                </Grid>
                <Grid item size={{xs:12, lg:6}}>
                  <ScenarioCombined
                    scenario={scenarioObjects[1]}
                  />
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
