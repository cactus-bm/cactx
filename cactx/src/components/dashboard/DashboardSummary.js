import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography,
  Grid
} from '@mui/material';
import ScenarioIcon from '@mui/icons-material/AccountTree';
import ComparisonIcon from '@mui/icons-material/CompareArrows';
import DateRangeIcon from '@mui/icons-material/DateRange';

const DashboardSummary = ({ scenarios }) => {
  // Calculate summary stats
  const totalScenarios = scenarios.length;
  const latestScenario = scenarios.length > 0 
    ? new Date(Math.max(...scenarios.map(s => new Date(s.createdAt).getTime()))).toLocaleDateString()
    : 'No scenarios yet';
  
  // Get unique comparison options
  const comparisonOptions = scenarios.length > 1 
    ? Math.floor(scenarios.length * (scenarios.length - 1) / 2) 
    : 0;
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card className="card" sx={{ bgcolor: 'primary.light', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ScenarioIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {totalScenarios}
                </Typography>
                <Typography variant="body2">
                  Total Scenarios
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card className="card" sx={{ bgcolor: 'secondary.light', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ComparisonIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {comparisonOptions}
                </Typography>
                <Typography variant="body2">
                  Comparison Options
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card className="card" sx={{ bgcolor: 'grey.700', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DateRangeIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" component="div" sx={{ wordBreak: 'break-word' }}>
                  {latestScenario}
                </Typography>
                <Typography variant="body2">
                  Latest Scenario
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardSummary;
