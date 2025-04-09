import React from 'react';
import { Box } from '@mui/material';

/**
 * Displays a horizontal stacked bar chart of ownership percentages
 * @param {Object} props - Component props
 * @param {Object} props.ownership - Ownership percentages object with catx, cactus, and ben properties
 */
const OwnershipChart = ({ ownership }) => {
  return (
    <Box sx={{ p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
      <Box sx={{ 
        height: 30, 
        display: 'flex', 
        width: '100%', 
        borderRadius: 1,
        overflow: 'hidden'
      }}>
        {ownership.catx > 0 && <Box 
          sx={{
            backgroundColor: 'secondary.light',
            width: `${ownership.catx}%`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            minWidth: '40px'
          }}>
          {ownership.catx}%
        </Box>}
        {ownership.cactus > 0 && <Box 
          sx={{
            backgroundColor: 'primary.light',
            width: `${ownership.cactus}%`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            minWidth: '40px'
          }}>
          {ownership.cactus}%
        </Box>}
        {ownership.ben > 0 && <Box 
          sx={{
            backgroundColor: 'warning.light',
            width: `${ownership.ben}%`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            minWidth: '40px'
          }}>
          {ownership.ben}%
        </Box>}
      </Box>
    </Box>
  );
};

export default OwnershipChart;
