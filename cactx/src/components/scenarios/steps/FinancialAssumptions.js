import React from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  Grid,
  Paper,
  TextField,
  InputAdornment
} from '@mui/material';

const FinancialAssumptions = ({ data, onChange }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Financial Assumptions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define the financial parameters and synergy expectations for this merger scenario
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Cost Synergies
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Expected reduction in combined expenses due to the merger
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <Slider
                  value={data.costSynergies}
                  onChange={(e, newValue) => onChange('costSynergies', newValue)}
                  aria-labelledby="cost-synergies-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  min={0}
                  max={30}
                />
              </Box>
              <Box sx={{ width: 80 }}>
                <TextField
                  value={data.costSynergies}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 0 && value <= 30) {
                      onChange('costSynergies', value);
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 30,
                    type: 'number',
                  }}
                />
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              {data.costSynergies < 5 ? 
                'Conservative estimate with minimal operational changes.' : 
                data.costSynergies < 15 ? 
                'Moderate synergies through standard integration practices.' : 
                'Aggressive cost-cutting and significant operational changes.'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Revenue Growth
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Expected increase in combined revenue due to the merger
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <Slider
                  value={data.revenueGrowth}
                  onChange={(e, newValue) => onChange('revenueGrowth', newValue)}
                  aria-labelledby="revenue-growth-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  min={0}
                  max={20}
                />
              </Box>
              <Box sx={{ width: 80 }}>
                <TextField
                  value={data.revenueGrowth}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 0 && value <= 20) {
                      onChange('revenueGrowth', value);
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 20,
                    type: 'number',
                  }}
                />
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              {data.revenueGrowth < 3 ? 
                'Minimal revenue synergies, focused on maintaining existing business.' : 
                data.revenueGrowth < 10 ? 
                'Moderate growth through cross-selling and market expansion.' : 
                'Aggressive growth requiring significant market penetration and new product development.'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Integration Costs
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              One-time costs associated with implementing the merger
            </Typography>
            
            <TextField
              fullWidth
              value={data.integrationCosts}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/,/g, ''), 10);
                if (!isNaN(value) && value >= 0) {
                  onChange('integrationCosts', value);
                }
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mt: 2 }}
            />
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              Integration costs typically include consultant fees, IT system integration, 
              rebranding, legal expenses, and potential severance payments.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Annual Growth Projections
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Expected yearly growth rates for the 5-year forecast
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Annual Revenue Growth Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <Slider
                    value={data.annualRevenueGrowth}
                    onChange={(e, newValue) => onChange('annualRevenueGrowth', newValue)}
                    step={0.5}
                    min={0}
                    max={15}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Box sx={{ width: 80 }}>
                  <TextField
                    value={data.annualRevenueGrowth}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 15) {
                        onChange('annualRevenueGrowth', value);
                      }
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    inputProps={{
                      step: 0.5,
                      min: 0,
                      max: 15,
                      type: 'number',
                    }}
                  />
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2">
                Annual Expense Growth Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <Slider
                    value={data.annualExpenseGrowth}
                    onChange={(e, newValue) => onChange('annualExpenseGrowth', newValue)}
                    step={0.5}
                    min={0}
                    max={10}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Box sx={{ width: 80 }}>
                  <TextField
                    value={data.annualExpenseGrowth}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 10) {
                        onChange('annualExpenseGrowth', value);
                      }
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    inputProps={{
                      step: 0.5,
                      min: 0,
                      max: 10,
                      type: 'number',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialAssumptions;
