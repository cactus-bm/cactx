import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Grid 
} from '@mui/material';

const BasicInfo = ({ data, onChange }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Basic Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide general information about this merger scenario
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Scenario Name"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g., Balanced Merger Plan"
            helperText="Give this scenario a descriptive name"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            multiline
            rows={4}
            placeholder="Describe the main characteristics and goals of this merger scenario..."
            helperText="Optionally provide details about this scenario's approach and objectives"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInfo;
