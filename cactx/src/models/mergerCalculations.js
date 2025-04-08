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
  const combinedCashOnHand = companyA.cashOnHand + companyB.cashOnHand;
  const combinedArr = companyA.arr + companyB.arr;
  
  // Fixed synergy effects (removed dynamic parameters)
  const synergySavings = 10; // Default 10% cost synergies
  const revenueBoost = 5; // Default 5% revenue growth
  
  // Calculate adjusted figures with synergies
  const adjustedArr = combinedArr * (1 + revenueBoost / 100);
  
  // Estimate expenses based on ARR (simplified model)
  const estimatedExpenses = combinedArr * 0.7; // Assuming 70% of ARR goes to expenses
  const adjustedExpenses = estimatedExpenses * (1 - synergySavings / 100);
  
  // Calculate profitability metrics
  const profit = adjustedArr - adjustedExpenses;
  const profitMargin = (profit / adjustedArr) * 100;
  
  return {
    cashOnHand: combinedCashOnHand,
    arr: adjustedArr,
    estimatedExpenses: adjustedExpenses,
    profit,
    profitMargin
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
  
  // Fixed optimization values (removed operational assumptions step)
  const workforceReduction = 5; // Default 5% workforce reduction
  const officeConsolidation = 10; // Default 10% office consolidation
  
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
  // Check if a custom valuation was provided
  if (scenario.catxValuation > 0 || scenario.cactusValuation > 0) {
    const customValue = scenario.catxValuation || scenario.cactusValuation;
    
    // If we have a custom valuation, use that directly
    return {
      totalValue: customValue,
      arrMultiple: (customValue / combinedFinancials.arr).toFixed(1),
      profitMultiple: (customValue / combinedFinancials.profit).toFixed(1),
      valuationMethod: scenario.catxValuation > 0 ? 'CatX Fixed Valuation' : 'Cactus Fixed Valuation',
      // Include the original values for reference
      arrBasedValue: combinedFinancials.arr * 5, // Using standard 5x multiple
      profitBasedValue: combinedFinancials.profit * 12, // Using standard 12x multiple
      cashBasedValue: combinedFinancials.cashOnHand
    };
  }
  
  // If no custom valuation, use the standard calculation method
  // SaaS company valuation is typically based on ARR multiples
  const arrMultiplier = scenario.arrMultiplier || 5; // Default 5x ARR
  const profitMultiplier = scenario.profitMultiplier || 12; // Higher multiple for profit in SaaS
  const cashMultiplier = 1.0; // Cash is valued at face value
  
  // Calculate valuations based on different methods
  const arrBasedValue = combinedFinancials.arr * arrMultiplier;
  const profitBasedValue = combinedFinancials.profit * profitMultiplier;
  const cashBasedValue = combinedFinancials.cashOnHand * cashMultiplier;
  
  // Weighted average valuation for SaaS companies typically weighs ARR higher
  const weightedValue = (
    (arrBasedValue * 0.6) + 
    (profitBasedValue * 0.3) + 
    (cashBasedValue * 0.1)
  );
  
  return {
    arrBasedValue,
    profitBasedValue,
    cashBasedValue,
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
  const arrGrowthRate = scenario.annualRevenueGrowth || 3;
  const expenseGrowthRate = scenario.annualExpenseGrowth || 2;
  
  let currentArr = combinedFinancials.arr;
  let currentExpenses = combinedFinancials.estimatedExpenses;
  let currentCashOnHand = combinedFinancials.cashOnHand;
  
  for (let i = 1; i <= years; i++) {
    // Calculate growth
    currentArr = currentArr * (1 + arrGrowthRate / 100);
    currentExpenses = currentExpenses * (1 + expenseGrowthRate / 100);
    
    const yearlyProfit = currentArr - currentExpenses;
    const yearlyProfitMargin = (yearlyProfit / currentArr) * 100;
    
    // Update cash based on profit
    currentCashOnHand += yearlyProfit;
    
    projections.push({
      year: i,
      arr: currentArr,
      expenses: currentExpenses,
      profit: yearlyProfit,
      profitMargin: yearlyProfitMargin,
      cashOnHand: currentCashOnHand
    });
  }
  
  return projections;
};
