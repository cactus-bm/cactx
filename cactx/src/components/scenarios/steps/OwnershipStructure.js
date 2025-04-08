import React from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  Grid,
  Paper,
  Divider
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
            <Typography variant="h3" gutterBottom align="center">
              {data.catx}%
            </Typography>
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
            <Typography variant="h3" gutterBottom align="center">
              {data.cactus}%
            </Typography>
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
