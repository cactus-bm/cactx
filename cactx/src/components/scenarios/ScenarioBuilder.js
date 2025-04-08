import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import { 
  selectScenarios, 
  selectCurrentScenario,
  addScenario,
  updateScenario,
  deleteScenario,
  setCurrentScenario
} from '../../store/scenariosSlice';
import { selectCompanies } from '../../store/companiesSlice';

import BasicInfo from './steps/BasicInfo';
import OwnershipStructure from './steps/OwnershipStructure';
import ValuationAssumptions from './steps/ValuationAssumptions';
// Removed OperationalAssumptions import
import ScenarioResults from './steps/ScenarioResults';

import { 
  calculateCombinedFinancials, 
  calculateValuation 
} from '../../models/mergerCalculations';

const steps = [
  'Basic Information',
  'Ownership Structure',
  'Valuation Assumptions',
  'Review Results'
];

const ScenarioBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const scenarios = useSelector(selectScenarios);
  const currentScenario = useSelector(selectCurrentScenario);
  const companies = useSelector(selectCompanies);
  
  const [activeStep, setActiveStep] = useState(0);
  const [scenarioData, setScenarioData] = useState({
    id: crypto.randomUUID(),

      basicInfo: {
      name: '',
      description: '',
    },
    createdAt: new Date().toISOString(),
    ownership: {
      catx: 12,
      cactus: 80,
      ben: 8
    },
    valuationAssumptions: {
      catxValuation: 0,
      cactusValuation: 25e6
    },
    results: null
  });
  
  // Load scenario data if editing existing scenario
  useEffect(() => {
    if (id) {
      const scenario = scenarios.find(s => s.id === id);
      if (scenario) {
        setScenarioData(scenario);
        dispatch(setCurrentScenario(scenario));
      } else {
        navigate('/scenarios');
      }
    } else {
      dispatch(setCurrentScenario(null));
    }
  }, [id, scenarios, dispatch, navigate]);
  
  // Calculate results whenever relevant inputs change
  useEffect(() => {
    if (companies.length >= 2) {
      const catx = companies.find(c => c.id === 'catx');
      const cactus = companies.find(c => c.id === 'cactus');
      
      if (catx && cactus) {
        // Calculate combined financials and metrics
        const combinedFinancials = calculateCombinedFinancials(
          catx, 
          cactus, 
          {} // Using default values in the calculation function
        );
        
        // Use valuation from user input if available
        const valuation = calculateValuation(
          combinedFinancials,
          {
            valuation: {
              catx: scenarioData.valuationAssumptions.catxValuation,
              cactus: scenarioData.valuationAssumptions.cactusValuation,
            },
            ownership: scenarioData.ownership
          }
        );
        
        // Update scenario data with results
        setScenarioData(prev => ({
          ...prev,
          results: {
            combinedFinancials,
            valuation,
          }
        }));
      }
    }
  }, [
    companies, 
    scenarioData.valuationAssumptions,
    scenarioData.ownership
  ]);
  
  // Handle step navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSave = () => {
    if (id) {
      dispatch(updateScenario(scenarioData));
    } else {
      dispatch(addScenario(scenarioData));
      navigate(`/scenarios/${scenarioData.id}`);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      dispatch(deleteScenario({ id: scenarioData.id }));
      navigate('/');
    }
  };
  
  // Handle form data changes
  const handleChange = (section, field, value) => {
    setScenarioData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  // Render the current step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfo 
            data={scenarioData.basicInfo} 
            onChange={(field, value) => handleChange('basicInfo', field, value)} 
          />
        );
      case 1:
        return (
          <OwnershipStructure 
            data={scenarioData.ownership} 
            onChange={(field, value) => handleChange('ownership', field, value)} 
          />
        );
      case 2:
        return (
          <ValuationAssumptions 
            data={scenarioData.valuationAssumptions} 
            onChange={(field, value) => handleChange('valuationAssumptions', field, value)} 
          />
        );
      case 3:
        return (
          <ScenarioResults 
            scenario={scenarioData}
            companies={companies}
          />
        );
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {id ? 'Edit Scenario' : 'Create New Scenario'}
          </Typography>
        </Box>
        
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ mr: 1 }}
          >
            Save Scenario
          </Button>
          
          {id && (
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>
      
      <Card className="card" sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {getStepContent(activeStep)}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSave : handleNext}
            color={activeStep === steps.length - 1 ? 'success' : 'primary'}
          >
            {activeStep === steps.length - 1 ? 'Save Scenario' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ScenarioBuilder;
