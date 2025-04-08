/**
 * Equity Calculation Utilities
 * 
 * This module provides functions for calculating equity splits
 * based on different investor types (equity, SAFE, employees)
 * and company valuations.
 */

/**
 * Calculate the equity split for all investors at a given valuation
 * 
 * @param {Object} investors - The investor dictionary containing equity, safe, and employees
 * @param {number} valuation - The company valuation used for SAFE conversions
 * @returns {Array} Array of investors with their names and equity percentages
 */
export const calculateSplit = (investors, valuation) => {
  if (!investors || !valuation || valuation <= 0) {
    throw new Error('Invalid inputs: investors and valuation (> 0) are required');
  }
  
  // Initialize result array to store all investors
  const result = [];
  
  // Calculate total SAFE investment and convert to equity
  const safeInvestors = convertSafeToEquity(investors.safe || [], valuation);
  
  // Calculate total employee options allocation
  const employeeInvestors = convertEmployeesToEquity(investors.employees || []);
  
  // Get direct equity investors
  const equityInvestors = (investors.equity || []).map(investor => ({
    name: investor.name,
    type: 'equity',
    percentage: investor.percentage
  }));
  
  // Combine all investor types
  const allInvestors = [...equityInvestors, ...safeInvestors, ...employeeInvestors];
  
  // Calculate total equity before normalization
  const totalEquity = allInvestors.reduce((sum, investor) => sum + investor.percentage, 0);
  
  // Normalize percentages to ensure they sum to 1.0 (100%)
  return allInvestors.map(investor => ({
    name: investor.name,
    type: investor.type,
    percentage: totalEquity > 0 ? investor.percentage / totalEquity : 0
  }));
};

/**
 * Convert SAFE investments to equity based on valuation
 * 
 * @param {Array} safeInvestors - Array of SAFE investors
 * @param {number} valuation - Company valuation
 * @returns {Array} SAFE investors converted to equity
 */
export const convertSafeToEquity = (safeInvestors, valuation) => {
  return safeInvestors.map(investor => {
    const effectiveValuation = investor.cap && investor.cap < valuation 
      ? investor.cap  // Use cap if it's lower than valuation
      : valuation;
    
    // Calculate ownership percentage using the investment amount divided by effective valuation
    const percentage = investor.amount / effectiveValuation;
    
    return {
      name: investor.name,
      type: 'safe',
      originalInvestment: investor.amount,
      cap: investor.cap,
      percentage
    };
  });
};

/**
 * Convert employee allocations to equity percentages
 * 
 * @param {Array} employeeInvestors - Array of employee investors
 * @returns {Array} Employee investors converted to equity percentages
 */
export const convertEmployeesToEquity = (employeeInvestors) => {
  // Calculate total allocation
  const totalAllocated = employeeInvestors.reduce((sum, investor) => sum + investor.allocated, 0);
  
  // Convert each allocation to a percentage
  return employeeInvestors.map(investor => {
    // If no allocations, return 0 percentage
    const percentage = totalAllocated > 0 ? investor.allocated / totalAllocated * 0.10 : 0; // Assume 10% for employee pool
    
    return {
      name: investor.name,
      type: 'employee',
      allocated: investor.allocated,
      percentage
    };
  });
};

/**
 * Get a summary of equity distribution by type
 * 
 * @param {Array} equitySplit - The result from calculateSplit
 * @returns {Object} Summary of equity percentages by type
 */
export const getEquitySummary = (equitySplit) => {
  const summary = {
    equity: 0,
    safe: 0,
    employee: 0
  };
  
  equitySplit.forEach(investor => {
    if (summary[investor.type] !== undefined) {
      summary[investor.type] += investor.percentage;
    }
  });
  
  return summary;
};

export default {
  calculateSplit,
  convertSafeToEquity,
  convertEmployeesToEquity,
  getEquitySummary
};
