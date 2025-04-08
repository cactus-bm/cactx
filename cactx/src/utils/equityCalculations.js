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
  
  // Calculate SAFE investments' equity percentages
  const safeInvestors = convertSafeToEquity(investors.safe || [], valuation);
  
  // Calculate total SAFE ownership
  const safeTotalPercentage = safeInvestors.reduce((sum, investor) => sum + investor.percentage, 0);
  
  // Calculate remaining equity (after SAFE conversion)
  const remainingEquity = 1 - safeTotalPercentage;
  
  // Calculate equity investors' adjusted percentages
  const equityTotal = (investors.equity || []).reduce((sum, investor) => sum + investor.percentage, 0);
  
  const equityInvestors = (investors.equity || []).map(investor => ({
    name: investor.name,
    type: 'equity',
    percentage: remainingEquity * (investor.percentage / equityTotal)
  }));
  
  // Employee allocation gets what's left after equity and SAFE
  const equityUsed = equityInvestors.reduce((sum, investor) => sum + investor.percentage, 0);
  const employeePercentage = remainingEquity - equityUsed;
  
  // Convert employee allocations
  const employeeInvestors = convertEmployeesToEquity(investors.employees || [], employeePercentage);
  
  // Combine all investor types into a single result array
  return [
    ...equityInvestors,
    ...safeInvestors,
    ...employeeInvestors
  ];
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
    // If cap is undefined or 0, use valuation
    const effectiveValuation = investor.cap && investor.cap > 0 && investor.cap < valuation 
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
 * @param {number} availablePercentage - The percentage available for employee allocation
 * @returns {Array|Object} Employee investors converted to equity percentages or residue object
 */
export const convertEmployeesToEquity = (employeeInvestors, availablePercentage) => {
  if (availablePercentage <= 1e-9) {
    return []
  }
  // If no employees, return the residue
  if (!employeeInvestors || employeeInvestors.length === 0) {
    return [{ name: "Residue", percentage: availablePercentage }];
  }
  
  // Calculate total allocation
  const totalAllocated = employeeInvestors.reduce((sum, investor) => sum + investor.allocated, 0);
  
  // Convert each allocation to a percentage
  return employeeInvestors.map(investor => {
    // Distribute the available percentage based on allocation ratio
    const percentage = totalAllocated > 0 ? (investor.allocated / totalAllocated) * availablePercentage : 0;
    
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
