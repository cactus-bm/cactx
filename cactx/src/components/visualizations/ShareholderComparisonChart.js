import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  Grid
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getCompanyColor } from '../../utils/colorUtils';
import { calculateSplit } from '../../models/equityCalculations';
import { useSelector } from 'react-redux';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Format percentage for display
const formatPercentage = (value) => {
  return (value * 100).toFixed(2) + '%';
};

const ShareholderComparisonChart = ({ scenarios }) => {
  const [selectedInvestors, setSelectedInvestors] = useState([]);
  const [allInvestors, setAllInvestors] = useState([]);
  const [chartData, setChartData] = useState(null);
  const companies = useSelector(state => state.companies.companies);
  
  // Extract all unique investors from both scenarios
  useEffect(() => {
    if (!scenarios || !scenarios[0] || !scenarios[1]) return;
    
    // Create a set of all unique investor names across both scenarios
    const uniqueInvestors = new Set();
    
    // Function to process investors for a scenario
    const processScenario = (scenario) => {
      if (!scenario) return;
      
      try {
        // First check if we have relevant data
        const ownership = scenario.ownership || {};
        const valuation = scenario.results?.valuation || {};
        
        // Filter companies with ownership
        const scenarioCompanies = companies.filter(company => 
          ownership[company.id] && ownership[company.id] > 0
        );

        // Process each company with ownership
        scenarioCompanies.forEach(company => {
          if (!company || !company.investors) return;
          
          try {
            // Get company valuation
            const companyValuation = valuation[company.id]?.valuation || 10000000;
            
            // Calculate and adjust investors based on ownership percentage
            const investorsList = calculateSplit(company.investors, companyValuation);
            
            if (Array.isArray(investorsList)) {
              // Adjust percentages based on company ownership
              const adjustedInvestors = investorsList.map(investor => ({
                ...investor,
                percentage: investor.percentage * ownership[company.id] / 100
              }));
              
              // Add investor names to the set
              adjustedInvestors.forEach(investor => {
                if (investor && investor.name) {
                  uniqueInvestors.add(investor.name);
                }
              });
            }
          } catch (error) {
            console.error('Error processing company investors:', error);
          }
        });
      } catch (error) {
        console.error('Error processing scenario:', error);
      }
    };

    
    // Process both scenarios
    processScenario(scenarios[0]);
    processScenario(scenarios[1]);
    
    // Get investor percentages for both scenarios
    const scenario1Percentages = {};
    const scenario2Percentages = {};
    
    try {
      // Process scenario 1
      const ownership1 = scenarios[0].ownership || {};
      const valuation1 = scenarios[0].results?.valuation || {};
      const scenarioCompanies1 = companies.filter(company => 
        ownership1[company.id] && ownership1[company.id] > 0
      );
      
      // Calculate percentages for scenario 1
      let combinedInvestors1 = [];
      scenarioCompanies1.forEach(company => {
        if (!company || !company.investors) return;
        
        try {
          const companyValuation = valuation1[company.id]?.valuation || 10000000;
          const investors = calculateSplit(company.investors, companyValuation);
          
          if (Array.isArray(investors)) {
            const adjustedInvestors = investors.map(investor => ({
              ...investor,
              percentage: investor.percentage * ownership1[company.id] / 100
            }));
            
            combinedInvestors1 = [...combinedInvestors1, ...adjustedInvestors];
          }
        } catch (error) {
          console.error('Error processing investor percentages:', error);
        }
      });
      
      // Sum percentages by investor name
      combinedInvestors1.forEach(investor => {
        if (investor && investor.name) {
          if (scenario1Percentages[investor.name]) {
            scenario1Percentages[investor.name] += investor.percentage || 0;
          } else {
            scenario1Percentages[investor.name] = investor.percentage || 0;
          }
        }
      });
      
      // Process scenario 2
      const ownership2 = scenarios[1].ownership || {};
      const valuation2 = scenarios[1].results?.valuation || {};
      const scenarioCompanies2 = companies.filter(company => 
        ownership2[company.id] && ownership2[company.id] > 0
      );
      
      // Calculate percentages for scenario 2
      let combinedInvestors2 = [];
      scenarioCompanies2.forEach(company => {
        if (!company || !company.investors) return;
        
        try {
          const companyValuation = valuation2[company.id]?.valuation || 10000000;
          const investors = calculateSplit(company.investors, companyValuation);
          
          if (Array.isArray(investors)) {
            const adjustedInvestors = investors.map(investor => ({
              ...investor,
              percentage: investor.percentage * ownership2[company.id] / 100
            }));
            
            combinedInvestors2 = [...combinedInvestors2, ...adjustedInvestors];
          }
        } catch (error) {
          console.error('Error processing investor percentages:', error);
        }
      });
      
      // Sum percentages by investor name
      combinedInvestors2.forEach(investor => {
        if (investor && investor.name) {
          if (scenario2Percentages[investor.name]) {
            scenario2Percentages[investor.name] += investor.percentage || 0;
          } else {
            scenario2Percentages[investor.name] = investor.percentage || 0;
          }
        }
      });
    } catch (error) {
      console.error('Error calculating percentages for sorting:', error);
    }
    
    // Get max percentage for each investor across both scenarios
    const maxPercentages = {};
    Array.from(uniqueInvestors).forEach(investor => {
      const percent1 = scenario1Percentages[investor] || 0;
      const percent2 = scenario2Percentages[investor] || 0;
      maxPercentages[investor] = Math.max(percent1, percent2);
    });
    
    // Sort investors by maximum percentage (descending)
    const investorsArray = Array.from(uniqueInvestors).sort((a, b) => {
      return maxPercentages[b] - maxPercentages[a];
    });
    
    setAllInvestors(investorsArray);
    
    // Initially select the top 5 investors (or all if less than 5)
    setSelectedInvestors(investorsArray.slice(0, Math.min(5, investorsArray.length)));
  }, [scenarios, companies]);
  
  // Reset chart data when scenarios change to avoid canvas reuse issues
  useEffect(() => {
    setChartData(null);
  }, [scenarios]);

  // Generate chart data when selected investors change
  useEffect(() => {
    if (!scenarios || !scenarios[0] || !scenarios[1] || selectedInvestors.length === 0) {
      setChartData(null);
      return;
    }
    
    // Generate chart data for the selected investors
    const labels = scenarios.map(s => s?.basicInfo?.name || 'Unnamed Scenario');
    
    // Function to get investor percentages for a scenario
    const getInvestorPercentages = (scenario) => {
      if (!scenario) return {};
      
      const result = {};
      try {
        // First check if we have relevant data
        const ownership = scenario.ownership || {};
        const valuation = scenario.results?.valuation || {};
        
        // Filter companies with ownership
        const scenarioCompanies = companies.filter(company => 
          ownership[company.id] && ownership[company.id] > 0
        );
        
        // Process each company with ownership
        let combinedInvestors = [];
        
        scenarioCompanies.forEach(company => {
          if (!company || !company.investors) return;
          
          try {
            // Get company valuation
            const companyValuation = valuation[company.id]?.valuation || 10000000;
            
            // Calculate investors and adjust based on ownership percentage
            const investors = calculateSplit(company.investors, companyValuation);
            
            if (Array.isArray(investors)) {
              // Adjust percentages based on company ownership
              const adjustedInvestors = investors.map(investor => ({
                ...investor,
                percentage: investor.percentage * ownership[company.id] / 100
              }));
              
              combinedInvestors = [...combinedInvestors, ...adjustedInvestors];
            }
          } catch (error) {
            console.error('Error calculating equity split:', error);
          }
        });
        
        // Group investors by name and sum their percentages
        combinedInvestors.forEach(investor => {
          if (investor && investor.name) {
            if (result[investor.name]) {
              result[investor.name] += investor.percentage || 0;
            } else {
              result[investor.name] = investor.percentage || 0;
            }
          }
        });
      } catch (error) {
        console.error('Error processing investor percentages:', error);
      }
      
      return result;
    };
    
    // Get percentages for both scenarios
    const scenario1Percentages = getInvestorPercentages(scenarios[0]);
    const scenario2Percentages = getInvestorPercentages(scenarios[1]);
    
    // Prepare datasets for selected investors
    const selectedDatasets = selectedInvestors.map((investor, index) => {
      return {
        label: investor,
        data: [
          scenario1Percentages[investor] || 0,
          scenario2Percentages[investor] || 0
        ],
        backgroundColor: getCompanyColor(investor),
        barPercentage: 0.8
      };
    });
    
    // Calculate "Other" category
    const calculateOtherPercentage = (percentages) => {
      let selectedTotal = 0;
      selectedInvestors.forEach(investor => {
        selectedTotal += percentages[investor] || 0;
      });
      
      // Other is everything that's not selected
      return Math.max(0, 1 - selectedTotal);
    };
    
    // Add "Other" dataset if there are unselected investors
    if (allInvestors.length > selectedInvestors.length) {
      selectedDatasets.push({
        label: 'Other',
        data: [
          calculateOtherPercentage(scenario1Percentages),
          calculateOtherPercentage(scenario2Percentages)
        ],
        backgroundColor: '#999999', // Always use gray for 'Other' category
        barPercentage: 0.8
      });
    }
    
    // Set chart data
    setChartData({
      labels,
      datasets: selectedDatasets
    });
  }, [scenarios, selectedInvestors, allInvestors, companies]);
  
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
  
  // If no scenarios are selected, show message
  if (!scenarios || !scenarios[0] || !scenarios[1]) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Shareholder Comparison
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select shareholders to compare equity across scenarios:
        </Typography>
        
        <Grid container spacing={1}>
          {allInvestors.length > 0 ? (
            allInvestors.map(investor => (
              <Grid item xs={4} key={investor}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={selectedInvestors.includes(investor)}
                      onChange={() => handleInvestorToggle(investor)}
                    />
                  }
                  label={investor}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                No shareholders found. Please ensure both scenarios have companies with investors.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      
      {chartData && (
        <Box>
          <Box sx={{ height: 400, mb: 3 }}>
            {chartData && (
              <Bar
                data={chartData}
                options={{
                  indexAxis: 'y', // This makes it a horizontal bar chart
                  scales: {
                    y: {
                      ticks: {
                        autoSkip: false,
                        padding: 5,
                        font: {
                          size: 11
                        }
                      }
                    },
                    x: {
                      beginAtZero: true,
                      max: 1,
                      ticks: {
                        callback: (value) => formatPercentage(value)
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return `${context.dataset.label}: ${formatPercentage(context.parsed.x)}`;
                        }
                      }
                    },
                    legend: {
                      position: 'top',
                      labels: {
                        boxWidth: 15
                      }
                    }
                  },
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pb: 2 }}>
            Equity distribution comparison between scenarios
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ShareholderComparisonChart;
