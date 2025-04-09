import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import { InvestorList } from '../investors/InvestorDistributionList';
import equityCalculations from '../../models/equityCalculations';


/**
 * Component that displays investor distribution lists for all companies in a scenario
 * that have ownership greater than 0%.
 * 
 * @param {Object} props Component props
 * @param {Object} props.scenario The scenario object containing ownership and valuation data
 */
const ScenarioCombined = ({ scenario }) => {
  const companies = useSelector(state => state.companies.companies);
  
  
  // Get the companies that have ownership in this scenario
  const scenarioCompanies = companies.filter(company => {
    return scenario.ownership[company.id] > 0;
  }).sort((a, b) => {
    return scenario.results.valuation[b.id].valuation - scenario.results.valuation[a.id].valuation;
  });

  const combinedInvestors = scenarioCompanies.map((company) => {
    return{
    investors: equityCalculations.calculateSplit(company.investors, scenario.results.valuation[company.id].valuation).map(investor => ({
      ...investor,
      percentage: investor.percentage * scenario.ownership[company.id] / 100
    })),
    companyValuation: scenario.results.valuation[company.id].valuation
  };
  });
  // If no scenario provided, display a message
  if (!scenario) {
    return (
      <Typography variant="body1" color="text.secondary">
        No scenario selected.
      </Typography>
    );
  }
  
  // If no companies have ownership, display a message
  if (scenarioCompanies.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No companies with ownership found in this scenario.
      </Typography>
    );
  }
  const totalValuation = combinedInvestors.reduce((sum, company) => sum + company.companyValuation, 0);
  const allInvestors = combinedInvestors.map(company => company.investors).flat();
  const groupedInvestors = allInvestors.reduce((groups, investor) => {
    if (!groups[investor.name]) {
      groups[investor.name] = [];
    }
    groups[investor.name].push(investor);
    return groups;
      }, {})
      // Convert grouped investors to array of objects with summed percentages
      const sortedInvestors = Object.entries(groupedInvestors).map(([name, investors]) => ({
        name,
        investors,
        percentage: investors.reduce((sum, investor) => sum + investor.percentage, 0),
      })).sort((a, b) => b.percentage - a.percentage);


  return (
    <Box sx={{ mt: 3, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Combined Equity Distributions
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Based on scenario: {scenario.basicInfo.name}
      </Typography>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Grid container spacing={2} direction="column">
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <InvestorList
                    investors={sortedInvestors}
                    valuation={totalValuation}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ScenarioCombined;
