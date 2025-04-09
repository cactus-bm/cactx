import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { getCompanyColor } from '../../utils/colorUtils';

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
        {Object.entries(ownership).filter(([company, percentage]) => percentage > 0).map(([company, percentage]) => (
          <Tooltip title={`${company}: ${percentage}%`} key={company}>
            <Box 
              sx={{
                width: `${percentage}%`,
                bgcolor: getCompanyColor(company),
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                minWidth: '40px',
                textShadow: '0px 0px 2px rgba(0,0,0,0.5)'
              }}
            >
              {percentage}%
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default OwnershipChart;
