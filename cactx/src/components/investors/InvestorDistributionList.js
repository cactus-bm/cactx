import React, { useMemo } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Divider,
  Chip
} from '@mui/material';
import { calculateSplit } from '../../models/equityCalculations';

/**
 * Formats a percentage value for display
 * @param {number} value - Value between 0 and 1
 * @returns {string} Formatted percentage string
 */
const formatPercentage = (value) => {
  return (value * 100).toFixed(2) + '%';
};

/**
 * Formats a currency value for display
 * @param {number} value - Monetary value
 * @returns {string} Formatted currency string
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Returns a color for the investor type chip
 * @param {string} type - Type of investor
 * @returns {string} Color code
 */
const getTypeColor = (type) => {
  switch(type) {
    case 'equity':
      return 'primary';
    case 'safe':
      return 'secondary';
    case 'employee':
      return 'success';
    default:
      return 'default';
  }
};

export const InvestorList = ({investors, valuation, title = "Investor Distribution"}) => (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Valuation: {formatCurrency(valuation)}
        </Typography>
      </Box>
      
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 2, '@media print': { pageBreakBefore: 'auto', breakAfter: 'page' } }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Investor</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Equity Percentage</TableCell>
              {/* Optional additional columns could be added here */}
            </TableRow>
          </TableHead>
          <TableBody>
            {investors.map((investor, index) => {
              if (investor.investors.length > 1) {
                return (<>
                <TableRow key={`${investor.name}-${index}`} hover>
                  <TableCell>{investor.name}</TableCell>
                  <TableCell/>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatPercentage(investor.percentage)}</TableCell>
                </TableRow>  
                {investor.investors.map((investorLine, index2) => (
                <TableRow key={`${investor.name}-${index}-${index2}`} hover>
                  <TableCell />
                  <TableCell>
                  <Chip 
                    label={investorLine.type}
                    size="small"
                    color={getTypeColor(investorLine.type)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  {formatPercentage(investorLine.percentage)}
                </TableCell>
              </TableRow>))}
            </>
            )}
            else {
              return (
              <TableRow key={`${investor.name}-${index}`} hover>
                <TableCell>{investor.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={investor.investors[0].type}
                    size="small"
                    color={getTypeColor(investor.investors[0].type)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatPercentage(investor.percentage)}</TableCell>
              </TableRow>
            );
            }
          })}

          </TableBody>
        </Table>
      </TableContainer>
    </Box>
)

/**
 * A component that displays a sorted list of investors based on their equity percentages
 * 
 * @param {Object} props The component props
 * @param {Object} props.investors - Object containing equity, safe, and employee investors
 * @param {number} props.valuation - The company valuation used for calculations
 * @param {string} props.title - Optional title for the component
 */
const InvestorDistributionList = ({ investors, valuation, title = "Investor Distribution" }) => {
  // Calculate and sort investors by percentage
  const sortedInvestors = useMemo(() => {
    if (!investors || !valuation) return [];
    
    try {
      // Calculate equity split using the utility function
      const calculatedInvestors = calculateSplit(investors, valuation);
      
      // Sort by percentage in descending order
      // Group investors by type
      const groupedInvestors = calculatedInvestors.reduce((groups, investor) => {
        if (!groups[investor.name]) {
          groups[investor.name] = [];
        }
        groups[investor.name].push(investor);
        return groups;
      }, {})
      // Convert grouped investors to array of objects with summed percentages
      return Object.entries(groupedInvestors).map(([name, investors]) => ({
        name,
        investors,
        percentage: investors.reduce((sum, investor) => sum + investor.percentage, 0),
      })).sort((a, b) => b.percentage - a.percentage);
    } catch (error) {
      console.error("Error calculating investor distribution:", error);
      return [];
    }
  }, [investors, valuation]);

  // Calculate total
  const total = useMemo(() => {
    return sortedInvestors.reduce((sum, investor) => sum + investor.percentage, 0);
  }, [sortedInvestors]);

  if (!investors || !valuation) {
    return (
      <Typography variant="body2" color="text.secondary">
        No investor data available.
      </Typography>
    );
  }

  return (
    <InvestorList investors={sortedInvestors} valuation={valuation} title={title} />
  );

};

export default InvestorDistributionList;
