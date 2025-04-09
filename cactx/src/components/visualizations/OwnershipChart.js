import React from 'react';
import { Box } from '@mui/material';

/**
 * Displays a horizontal stacked bar chart of ownership percentages
 * @param {Object} props - Component props
 * @param {Object} props.ownership - Ownership percentages object with catx, cactus properties
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
        {Object.entries(ownership).map(([company, percentage]) => (
          <Box 
            key={company}
            sx={{
              width: `${percentage}%`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              minWidth: '40px'
            }}
          >
            {percentage}%
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OwnershipChart;
