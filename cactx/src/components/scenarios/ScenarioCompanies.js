import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import InvestorDistributionList from '../investors/InvestorDistributionList';


/**
 * Component that displays investor distribution lists for all companies in a scenario
 * that have ownership greater than 0%.
 * 
 * @param {Object} props Component props
 * @param {Object} props.scenario The scenario object containing ownership and valuation data
 */
const ScenarioCompanies = ({ scenario }) => {
  const companies = useSelector(state => state.companies.companies);
  
  // If no scenario provided, display a message
  if (!scenario) {
    return (
      <Typography variant="body1" color="text.secondary">
        No scenario selected.
      </Typography>
    );
  }
  
  // Get the companies that have ownership in this scenario
  const scenarioCompanies = companies.filter(company => {
    return scenario.ownership[company.id] > 0;
  });
  
  // If no companies have ownership, display a message
  if (scenarioCompanies.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No companies with ownership found in this scenario.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Company Equity Distributions
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Based on scenario: {scenario.basicInfo.name}
      </Typography>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Grid container spacing={2} direction="column">
          {scenarioCompanies.map(company => {
          const ownershipPercentage = scenario.ownership[company.id];
          const companyValuation = scenario.results.valuation[company.id].valuation;
          
          // Skip companies with no ownership or valuation
          if (ownershipPercentage <= 0 || !companyValuation) {
            return null;
          }
          
          return (
            <Grid item xs={12} key={company.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                      {company.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ownership: {ownershipPercentage}%
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <InvestorDistributionList
                    investors={company.investors}
                    valuation={companyValuation}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        </Grid>
      </Box>
    </Box>
  );
};

export default ScenarioCompanies;
