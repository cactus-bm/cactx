/**
 * Merger calculation utilities for Cactx
 */

/**
 * Calculate combined financial metrics for a merger scenario
 * @param {Object} companyA - First company data
 * @param {Object} companyB - Second company data
 * @param {Object} scenario - Merger scenario configuration
 * @returns {Object} Combined financial metrics
 */
export const calculateCombinedFinancials = (companyA, companyB, scenario) => {
  // Basic combination of financials
  const combinedRevenue = companyA.financials.revenue + companyB.financials.revenue;
  const combinedExpenses = companyA.financials.expenses + companyB.financials.expenses;
  
  // Apply synergy effects if defined in scenario
  const synergySavings = scenario.costSynergies || 0;
  const revenueBoost = scenario.revenueGrowth || 0;
  
  // Calculate adjusted figures with synergies
  const adjustedRevenue = combinedRevenue * (1 + revenueBoost / 100);
  const adjustedExpenses = combinedExpenses * (1 - synergySavings / 100);
  
  // Calculate profitability metrics
  const profit = adjustedRevenue - adjustedExpenses;
  const profitMargin = (profit / adjustedRevenue) * 100;
  
  // Calculate combined asset metrics
  const combinedAssets = companyA.financials.assets + companyB.financials.assets;
  const combinedLiabilities = companyA.financials.liabilities + companyB.financials.liabilities;
  const netWorth = combinedAssets - combinedLiabilities;
  
  return {
    revenue: adjustedRevenue,
    expenses: adjustedExpenses,
    profit,
    profitMargin,
    assets: combinedAssets,
    liabilities: combinedLiabilities,
    netWorth
  };
};

/**
 * Calculate operational metrics for a merged entity
 * @param {Object} companyA - First company data
 * @param {Object} companyB - Second company data
 * @param {Object} scenario - Merger scenario configuration
 * @returns {Object} Combined operational metrics
 */
export const calculateOperationalMetrics = (companyA, companyB, scenario) => {
  // Basic combination of operational metrics
  const combinedEmployees = companyA.metrics.employees + companyB.metrics.employees;
  const combinedOffices = companyA.metrics.offices + companyB.metrics.offices;
  
  // Apply workforce optimization if defined in scenario
  const workforceReduction = scenario.workforceReduction || 0;
  const officeConsolidation = scenario.officeConsolidation || 0;
  
  // Calculate adjusted figures with optimizations
  const adjustedEmployees = combinedEmployees * (1 - workforceReduction / 100);
  const adjustedOffices = combinedOffices * (1 - officeConsolidation / 100);
  
  // Calculate combined market share (simplified - in reality would need more complex modeling)
  const combinedMarketShare = companyA.metrics.marketShare + companyB.metrics.marketShare;
  
  return {
    employees: Math.round(adjustedEmployees),
    offices: Math.round(adjustedOffices),
    marketShare: combinedMarketShare
  };
};

/**
 * Perform valuation of the combined entity
 * @param {Object} combinedFinancials - Financial metrics of combined entity
 * @param {Object} scenario - Merger scenario configuration
 * @returns {Object} Valuation metrics
 */
export const calculateValuation = (combinedFinancials, scenario) => {
  // Simple multiplier-based valuation
  const revenueMultiplier = scenario.revenueMultiplier || 2;
  const profitMultiplier = scenario.profitMultiplier || 10;
  
  // Calculate valuations based on different methods
  const revenueBasedValue = combinedFinancials.revenue * revenueMultiplier;
  const profitBasedValue = combinedFinancials.profit * profitMultiplier;
  const assetBasedValue = combinedFinancials.netWorth * 1.2; // 20% premium on net assets
  
  // Weighted average valuation
  const weightedValue = (
    (revenueBasedValue * 0.3) + 
    (profitBasedValue * 0.5) + 
    (assetBasedValue * 0.2)
  );
  
  return {
    revenueBasedValue,
    profitBasedValue,
    assetBasedValue,
    weightedValue
  };
};

/**
 * Create projection for future years based on merger scenario
 * @param {Object} combinedFinancials - Financial metrics of combined entity
 * @param {Object} scenario - Merger scenario configuration
 * @param {number} years - Number of years to project
 * @returns {Array} Yearly projections
 */
export const createProjections = (combinedFinancials, scenario, years = 5) => {
  const projections = [];
  const baseRevenue = combinedFinancials.revenue;
  const baseExpenses = combinedFinancials.expenses;
  
  // Growth assumptions
  const annualRevenueGrowth = scenario.annualRevenueGrowth || 5; // 5% default
  const annualExpenseGrowth = scenario.annualExpenseGrowth || 3; // 3% default
  
  // Generate projections for each year
  for (let year = 1; year <= years; year++) {
    const yearlyRevenue = baseRevenue * Math.pow(1 + annualRevenueGrowth / 100, year);
    const yearlyExpenses = baseExpenses * Math.pow(1 + annualExpenseGrowth / 100, year);
    const yearlyProfit = yearlyRevenue - yearlyExpenses;
    const yearlyProfitMargin = (yearlyProfit / yearlyRevenue) * 100;
    
    projections.push({
      year,
      revenue: yearlyRevenue,
      expenses: yearlyExpenses,
      profit: yearlyProfit,
      profitMargin: yearlyProfitMargin
    });
  }
  
  return projections;
};
