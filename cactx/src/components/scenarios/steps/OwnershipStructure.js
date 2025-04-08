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

const OwnershipStructure = ({ data, onChange }) => {
  const handleCatXChange = (event, newValue) => {
    onChange('catx', newValue);
    onChange('cactus', 100 - newValue);
  };
  
  const handleCactusChange = (event, newValue) => {
    onChange('cactus', newValue);
    onChange('catx', 100 - newValue);
  };
  
  const handleCatXInputChange = (event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    if (!isNaN(value)) {
      onChange('catx', value);
      onChange('cactus', 100 - value);
    }
  };
  
  const handleCactusInputChange = (event) => {
    const value = Math.min(100, Math.max(0, Number(event.target.value)));
    if (!isNaN(value)) {
      onChange('cactus', value);
      onChange('catx', 100 - value);
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
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'secondary.light', color: 'white' }}>
            <Typography variant="h6" gutterBottom>
              CatX Ownership
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <TextField
                value={data.catx}
                onChange={handleCatXInputChange}
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
              value={data.catx}
              onChange={handleCatXChange}
              aria-labelledby="catx-ownership-slider"
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={100}
              sx={{
                color: 'white',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="h6" gutterBottom>
              Cactus Ownership
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <TextField
                value={data.cactus}
                onChange={handleCactusInputChange}
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
                  'aria-labelledby': 'cactus-ownership-input',
                }}
              />
            </Box>
            <Slider
              value={data.cactus}
              onChange={handleCactusChange}
              aria-labelledby="cactus-ownership-slider"
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={100}
              sx={{
                color: 'white',
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ownership Distribution
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ 
              height: 40, 
              display: 'flex', 
              width: '100%', 
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <Box 
                sx={{ 
                  width: `${data.catx}%`, 
                  bgcolor: 'secondary.main', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'width 0.3s ease'
                }}
              >
                {data.catx > 10 && (
                  <Typography variant="body2" fontWeight="bold">
                    CatX {data.catx}%
                  </Typography>
                )}
              </Box>
              <Box 
                sx={{ 
                  width: `${data.cactus}%`, 
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'width 0.3s ease'
                }}
              >
                {data.cactus > 10 && (
                  <Typography variant="body2" fontWeight="bold">
                    Cactus {data.cactus}%
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This visualization shows the relative ownership percentage between CatX and Cactus in the merged company.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnershipStructure;
