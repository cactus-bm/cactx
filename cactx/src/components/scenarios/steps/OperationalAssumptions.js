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

const OperationalAssumptions = ({ data, onChange }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Operational Assumptions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define the operational changes and workforce adjustments for this merger scenario
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item size={{xs:12, md:6}}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Workforce Reduction
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Expected reduction in total workforce due to redundancies
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <Slider
                  value={data.workforceReduction}
                  onChange={(e, newValue) => onChange('workforceReduction', newValue)}
                  aria-labelledby="workforce-reduction-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  min={0}
                  max={25}
                />
              </Box>
              <Box sx={{ width: 80 }}>
                <TextField
                  value={data.workforceReduction}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 0 && value <= 25) {
                      onChange('workforceReduction', value);
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 25,
                    type: 'number',
                  }}
                />
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              {data.workforceReduction < 5 ? 
                'Minimal workforce changes focusing on natural attrition and voluntary departures.' : 
                data.workforceReduction < 15 ? 
                'Moderate reduction addressing clear redundancies in overlapping departments.' : 
                'Significant restructuring with substantial layoffs and department consolidations.'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item size={{xs:12, md:6}}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Office Consolidation
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Expected reduction in total office locations
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <Slider
                  value={data.officeConsolidation}
                  onChange={(e, newValue) => onChange('officeConsolidation', newValue)}
                  aria-labelledby="office-consolidation-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  min={0}
                  max={50}
                />
              </Box>
              <Box sx={{ width: 80 }}>
                <TextField
                  value={data.officeConsolidation}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 0 && value <= 50) {
                      onChange('officeConsolidation', value);
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 50,
                    type: 'number',
                  }}
                />
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              {data.officeConsolidation < 10 ? 
                'Maintaining most existing locations with minimal consolidation.' : 
                data.officeConsolidation < 30 ? 
                'Consolidating overlapping offices in the same geographic areas.' : 
                'Major real estate consolidation and potential headquarter relocation.'}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Integration Timeline
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Expected time to complete the operational integration (in months)
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <Slider
                  value={data.integrationTimeline}
                  onChange={(e, newValue) => onChange('integrationTimeline', newValue)}
                  aria-labelledby="integration-timeline-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  min={3}
                  max={36}
                  marks={[
                    { value: 3, label: '3m' },
                    { value: 12, label: '12m' },
                    { value: 24, label: '24m' },
                    { value: 36, label: '36m' }
                  ]}
                />
              </Box>
              <Box sx={{ width: 80 }}>
                <TextField
                  value={data.integrationTimeline}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 3 && value <= 36) {
                      onChange('integrationTimeline', value);
                    }
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mo</InputAdornment>,
                  }}
                  inputProps={{
                    step: 1,
                    min: 3,
                    max: 36,
                    type: 'number',
                  }}
                />
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              {data.integrationTimeline <= 6 ? 
                'Aggressive timeline requiring intensive effort and potential disruption.' : 
                data.integrationTimeline <= 18 ? 
                'Standard integration timeline with methodical approach to changes.' : 
                'Conservative timeline prioritizing minimal disruption over quick changes.'}
            </Typography>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Integration Phases:</strong>
                <br />
                • Day 1 (Closing): Legal combination, basic brand integration
                <br />
                • Phase 1 (1-3 months): Leadership structure, communication plans
                <br />
                • Phase 2 (3-{Math.min(data.integrationTimeline, 12)} months): Systems integration, workforce adjustments
                <br />
                • Phase 3 (to {data.integrationTimeline} months): Full operational integration, culture alignment
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OperationalAssumptions;
