import React from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  Grid,
  Paper,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectCompanies } from '../../../store/companiesSlice';
import OwnershipChart from '../../visualizations/OwnershipChart';
import { getCompanyColor } from '../../../utils/colorUtils';

const OwnershipStructure = ({ data, onChange, companies }) => {
  
  // Handler for adjusting values to ensure they sum to 100%
  const adjustValues = (field, newValue) => {
    // Get current values
    const current = { ...data,
      [field]: newValue
    };
    
    // Update all fields in the state
    Object.keys(current).forEach(key => {
      onChange(key, current[key]);
    });
  };
  
  // Change handlers for each owner
  const handleChange = (companyId, newValue) => {
    adjustValues(companyId, newValue);
  };
  
  const handleInputChange = (id, event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    if (!isNaN(value)) {
      adjustValues(id, value);
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ownership Structure
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define the ownership percentages for each company in the merged entity
      </Typography>
      
      <Grid container spacing={3}>
        {companies.map(company => (
          <Grid item size={{xs:12, md:4}} key={company.id}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: 'grey.800', 
              color: 'white', 
              height: '100%',
              borderLeft: `5px solid ${getCompanyColor(company.id)}`
            }}>
              <Typography variant="h6" gutterBottom>
                {company.name} Ownership
              </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <TextField
                value={data[company.id]}
                onChange={(e) => handleInputChange(company.id, e)}
                variant="outlined"
                size="small"
                sx={{ 
                  width: '100px', 
                  input: { color: 'white', textAlign: 'center' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' },
                  }
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end" sx={{ color: 'white' }}>%</InputAdornment>,
                }}
                inputProps={{
                  min: 0,
                  max: 100,
                  type: 'number',
                  'aria-labelledby': 'catx-ownership-input',
                }}
              />
            </Box>
            <Slider
              value={data[company.id] || 0}
              onChange={(event, newValue) => handleChange(company.id, newValue)}
              aria-labelledby={`${company.id}-ownership-slider`}
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={100}
              sx={{
                color: getCompanyColor(company.id),
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                  borderColor: getCompanyColor(company.id),
                  borderWidth: 2,
                  borderStyle: 'solid',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            />
          </Paper>
        </Grid>
        ))}
        
        <Grid item size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ownership Distribution
            </Typography>
            <Divider sx={{ my: 2 }} />
            <OwnershipChart ownership={data} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This visualization shows the relative ownership percentage between all companies in the merged entity.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnershipStructure;
