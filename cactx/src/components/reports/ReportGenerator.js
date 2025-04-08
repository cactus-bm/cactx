import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
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

const ReportGenerator = () => {
  const navigate = useNavigate();
  const scenarios = useSelector(selectScenarios);
  const companies = useSelector(selectCompanies);
  
  const [selectedScenario, setSelectedScenario] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [selectedSections, setSelectedSections] = useState({
    basicInfo: true,
    financialResults: true,
    operationalResults: true,
    projections: true,
    recommendations: false
  });
  const [recommendations, setRecommendations] = useState('');
  
  const reportRef = useRef(null);
  
  // Find the selected scenario object
  const scenarioObject = scenarios.find(s => s.id === selectedScenario);
  
  // Toggle section selection
  const handleSectionToggle = (section) => {
    setSelectedSections({
      ...selectedSections,
      [section]: !selectedSections[section]
    });
  };
  
  // Generate report content
  const generateReport = () => {
    // In a real app, this would generate a PDF or printable report
    // For this demo, we'll just scroll to the report preview
    if (reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
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
          Report Generator
        </Typography>
      </Box>
      
      {scenarios.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No Scenarios Available
          </Typography>
          <Typography variant="body1" paragraph>
            You need to create at least one scenario to generate a report.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/scenarios')}
          >
            Create A Scenario
          </Button>
        </Paper>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Report Configuration
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Scenario</InputLabel>
                  <Select
                    value={selectedScenario}
                    label="Select Scenario"
                    onChange={(e) => setSelectedScenario(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select a scenario</em>
                    </MenuItem>
                    {scenarios.map((scenario) => (
                      <MenuItem key={scenario.id} value={scenario.id}>
                        {scenario.basicInfo.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Report Title"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Merger Analysis Report"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Sections to Include
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedSections.basicInfo}
                        onChange={() => handleSectionToggle('basicInfo')}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Basic Information" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedSections.recommendations}
                        onChange={() => handleSectionToggle('recommendations')}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Recommendations" />
                  </ListItem>
                </List>
              </Grid>
              
              {selectedSections.recommendations && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Recommendations"
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    multiline
                    rows={4}
                    placeholder="Enter your recommendations and insights about this merger scenario..."
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<DescriptionIcon />}
                  onClick={generateReport}
                  disabled={!selectedScenario || !reportTitle}
                  fullWidth
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          {selectedScenario && scenarioObject && reportTitle && (
            <div ref={reportRef}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DescriptionIcon sx={{ mr: 2 }} />
                <Typography variant="h5" component="h2">
                  Report Preview
                </Typography>
              </Box>
              
              <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                  {reportTitle}
                </Typography>
                <Typography variant="subtitle1" align="center" gutterBottom>
                  Generated on {new Date().toLocaleDateString()}
                </Typography>
                <Divider sx={{ my: 3 }} />
                
                {selectedSections.basicInfo && (
                  <>
                    <Typography variant="h5" gutterBottom>
                      Scenario Overview
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <strong>Scenario Name:</strong> {scenarioObject.basicInfo.name}
                    </Typography>
                    {scenarioObject.basicInfo.description && (
                      <Typography variant="body1" paragraph>
                        <strong>Description:</strong> {scenarioObject.basicInfo.description}
                      </Typography>
                    )}
                    <Typography variant="body1" paragraph>
                      <strong>Created:</strong> {new Date(scenarioObject.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      <strong>Ownership Structure:</strong> 
                      {scenarioObject.ownership?.catx > 0 ? `CatX (${scenarioObject.ownership.catx}%) ` : ''}
                      {scenarioObject.ownership?.cactus > 0 ? `Cactus (${scenarioObject.ownership.cactus}%) ` : ''}
                      {scenarioObject.ownership?.ben > 0 ? `Ben (${scenarioObject.ownership.ben}%)` : ''}
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                  </>
                )}
                
                {selectedSections.recommendations && recommendations && (
                  <>
                    <Typography variant="h5" gutterBottom>
                      Recommendations
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {recommendations}
                    </Typography>
                  </>
                )}
                
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    sx={{ px: 4 }}
                  >
                    Download PDF
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    (Download functionality would be implemented in a production version)
                  </Typography>
                </Box>
              </Paper>
            </div>
          )}
        </>
      )}
    </Box>
  );
};

export default ReportGenerator;
