import React, { useState, useRef, useEffect } from 'react';
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
  Checkbox,
  Alert,
  Snackbar,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { selectScenarios } from '../../store/scenariosSlice';
import { selectCompanies } from '../../store/companiesSlice';
import ScenarioCompanies from '../scenarios/ScenarioCompanies';
import ScenarioCombined from '../scenarios/ScenarioCombined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import IconButton from '@mui/material/IconButton';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import MDEditor from '@uiw/react-md-editor';
import { getCompanyColor } from '../../utils/colorUtils';
import { calculateSplit } from '../../models/equityCalculations';

// Format currency values
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

// Format percentage values
const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0%';
  return `${(value * 100).toFixed(1)}%`;
};

const ReportGenerator = () => {
  const navigate = useNavigate();
  const scenarios = useSelector(selectScenarios);
  const companies = useSelector(selectCompanies);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  
  const [selectedScenario, setSelectedScenario] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [selectedSections, setSelectedSections] = useState({
    basicInfo: true,
    financialResults: true,
    operationalResults: true,
    projections: true,
    companies: true,
    combined: true,
    recommendations: false,
    shareholderComparison: false
  });
  const [recommendations, setRecommendations] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // State for shareholder comparison chart
  const [allInvestors, setAllInvestors] = useState([]);
  const [selectedInvestors, setSelectedInvestors] = useState([]);
  const [shareholderChartData, setShareholderChartData] = useState(null);
  
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
  
  // Handle investor checkbox toggle
  const handleInvestorToggle = (investor) => {
    setSelectedInvestors(prev => {
      if (prev.includes(investor)) {
        return prev.filter(i => i !== investor);
      } else {
        return [...prev, investor];
      }
    });
  };
  
  // Load all investors whenever selected scenario changes
  useEffect(() => {
    if (!scenarioObject) {
      setAllInvestors([]);
      setSelectedInvestors([]);
      return;
    }
    
    try {
      // Get all companies in this scenario
      const scenarioCompanies = companies.filter(company => 
        scenarioObject.ownership && scenarioObject.ownership[company.id] > 0
      );
      
      // Collect all investors
      const uniqueInvestors = new Set();
      
      scenarioCompanies.forEach(company => {
        if (!company || !company.investors) return;
        
        try {
          const companyValuation = scenarioObject.valuation?.[company.id]?.valuation || 10000000;
          const investors = calculateSplit(company.investors, companyValuation);
          
          if (Array.isArray(investors)) {
            investors.forEach(investor => {
              if (investor && investor.name) {
                uniqueInvestors.add(investor.name);
              }
            });
          }
        } catch (error) {
          console.error('Error processing investors:', error);
        }
      });
      
      // Convert to array and sort
      const investorsArray = Array.from(uniqueInvestors).sort();
      setAllInvestors(investorsArray);
      
      // Initially select the top 5 investors (or all if less than 5)
      setSelectedInvestors(investorsArray.slice(0, Math.min(5, investorsArray.length)));
    } catch (error) {
      console.error('Error loading investors:', error);
      setAllInvestors([]);
      setSelectedInvestors([]);
    }
  }, [scenarioObject, companies]);
  
  // Generate chart data when selected investors change
  useEffect(() => {
    if (!scenarioObject || selectedInvestors.length === 0) {
      setShareholderChartData(null);
      return;
    }
    
    try {
      // Get scenario companies
      const scenarioCompanies = companies.filter(company => 
        scenarioObject.ownership && scenarioObject.ownership[company.id] > 0
      );
      
      // Calculate investor percentages
      const investorPercentages = {};
      
      // Process all companies in the scenario
      scenarioCompanies.forEach(company => {
        if (!company || !company.investors) return;
        
        try {
          const companyValuation = scenarioObject.valuation?.[company.id]?.valuation || 10000000;
          const investors = calculateSplit(company.investors, companyValuation);
          
          if (Array.isArray(investors)) {
            // Adjust percentages based on company ownership in scenario
            const adjustedInvestors = investors.map(investor => ({
              ...investor,
              percentage: investor.percentage * scenarioObject.ownership[company.id] / 100
            }));
            
            // Sum percentages by investor name
            adjustedInvestors.forEach(investor => {
              if (investor && investor.name) {
                if (investorPercentages[investor.name]) {
                  investorPercentages[investor.name] += investor.percentage || 0;
                } else {
                  investorPercentages[investor.name] = investor.percentage || 0;
                }
              }
            });
          }
        } catch (error) {
          console.error('Error processing investor percentages:', error);
        }
      });
      
      // Prepare chart data for selected investors
      const chartDatasets = selectedInvestors.map(investor => ({
        label: investor,
        data: [investorPercentages[investor] || 0],
        backgroundColor: getCompanyColor(investor)
      }));
      
      // Calculate "Other" category if needed
      if (allInvestors.length > selectedInvestors.length) {
        let otherPercentage = 0;
        
        // Sum percentages for all non-selected investors
        allInvestors.forEach(investor => {
          if (!selectedInvestors.includes(investor)) {
            otherPercentage += investorPercentages[investor] || 0;
          }
        });
        
        // Add "Other" dataset if there's any percentage to show
        if (otherPercentage > 0) {
          chartDatasets.push({
            label: 'Other',
            data: [otherPercentage],
            backgroundColor: '#999999' // Gray for 'Other' category
          });
        }
      }
      
      // Set chart data for use in the report
      setShareholderChartData({
        labels: [scenarioObject.basicInfo.name],
        datasets: chartDatasets
      });
    } catch (error) {
      console.error('Error generating chart data:', error);
      setShareholderChartData(null);
    }
  }, [scenarioObject, selectedInvestors, allInvestors, companies]);
  
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
              <Grid item size={{xs:12, md:6}}>
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
              
              <Grid item size={{xs:12, md:6}}>
                <TextField
                  fullWidth
                  label="Report Title"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Merger Analysis Report"
                />
              </Grid>
              
              <Grid item size={{xs:12}}>
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
                  <ListItem>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedSections.shareholderComparison}
                        onChange={() => handleSectionToggle('shareholderComparison')}
                      />
                    </ListItemIcon>
                    <ListItemText primary="Shareholder Comparison Chart" />
                  </ListItem>
                </List>
              </Grid>
              
              {selectedSections.recommendations && (
                <Grid item size={{xs:12}}>
                  <Typography variant="subtitle1" gutterBottom>
                    Recommendations (Markdown Supported)
                  </Typography>
                  <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                    <MDEditor
                      value={recommendations}
                      onChange={setRecommendations}
                      height={250}
                      preview="edit"
                      placeholder="Enter your recommendations and insights about this merger scenario..."
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Tip: You can use Markdown formatting to add headers, lists, bold text, and more to your recommendations.
                  </Typography>
                </Grid>
              )}
              
              {selectedSections.shareholderComparison && selectedScenario && (
                <Grid item size={{xs:12}}>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Shareholders to Compare
                  </Typography>
                  <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {allInvestors.sort().map(investor => (
                      <FormControlLabel
                        key={investor}
                        control={
                          <Checkbox 
                            checked={selectedInvestors.includes(investor)}
                            onChange={() => handleInvestorToggle(investor)}
                            size="small"
                          />
                        }
                        label={investor}
                        sx={{ width: '33%', minWidth: '200px' }}
                      />
                    ))}
                  </FormGroup>
                  {allInvestors.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No shareholders found in this scenario.
                    </Typography>
                  )}
                </Grid>
              )}
              
              <Grid item size={{xs:12}}>
              </Grid>
            </Grid>
          </Paper>
          
          {selectedScenario && scenarioObject && (
            <div ref={reportRef}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DescriptionIcon sx={{ mr: 2 }} />
                <Typography variant="h5" component="h2">
                  Report Preview
                </Typography>
              </Box>
              
              <Paper 
                sx={{ 
                  p: 4, 
                  mb: 4,
                  ...(fullScreenMode && {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1300,
                    borderRadius: 0,
                  })
                }} 
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <IconButton onClick={() => setFullScreenMode(!fullScreenMode)}>
                    {fullScreenMode ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Box>
                <Typography variant="h4" align="center" gutterBottom>
                  {reportTitle || scenarioObject.basicInfo.name}
                </Typography>
                <Typography variant="subtitle1" align="center" gutterBottom>
                  Generated on {new Date().toLocaleDateString()}
                </Typography>
                <Divider sx={{ my: 3 }} />
                
                {selectedSections.shareholderComparison && shareholderChartData && shareholderChartData.datasets.length > 0 && (
                  <>
                    <Typography variant="h5" gutterBottom>
                      Shareholder Distribution
                    </Typography>
                    <Box sx={{ mb: 4, height: 300 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ flex: 1, display: 'flex' }}>
                          {/* Y-axis labels */}
                          <Box sx={{ width: 150, pr: 2, textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pt: 2, pb: 2 }}>
                            {shareholderChartData.datasets.map((dataset, index) => (
                              <Typography key={index} variant="body2" noWrap>
                                {dataset.label}
                              </Typography>
                            ))}
                          </Box>
                          
                          {/* Bars */}
                          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pt: 2, pb: 2 }}>
                            {shareholderChartData.datasets.map((dataset, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', height: 24 }}>
                                <Box 
                                  sx={{
                                    width: `${Math.max(dataset.data[0] * 100, 0.5)}%`,
                                    backgroundColor: dataset.backgroundColor,
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    pr: 1,
                                    borderRadius: '2px',
                                    color: 'white',
                                    minWidth: '30px',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  {formatPercentage(dataset.data[0])}
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                  </>
                )}
                
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
                      {companies.map(c => scenarioObject.ownership?.[c.id] > 0 ? `${c.name} (${scenarioObject.ownership[c.id]}%) ` : '')}
                    </Typography>
                  </>
                )}
                
                {selectedSections.recommendations && recommendations && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h5" gutterBottom>
                      Recommendations
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <MDEditor.Markdown source={recommendations} style={{ backgroundColor: 'transparent' }} />
                    </Box>
                  </>
                )}
                <Divider sx={{ my: 3, '@media print': { pageBreakAfter: 'always', breakAfter: 'page' } }} />

                <ScenarioCompanies 
                  scenario={scenarioObject}
                  companies={companies}
                />


                <ScenarioCombined 
                  scenario={scenarioObject}
                  companies={companies}
                />
                <Box
  sx={{
    height: 0,
    display: 'none',
    '@media print': {
      display: 'block',
      height: '100vh',
      pageBreakAfter: 'always',
      breakAfter: 'page'
    }
  }}
/>
                
              </Paper>
            </div>
          )}
        </>
      )}
    </Box>
  );
};

export default ReportGenerator;
