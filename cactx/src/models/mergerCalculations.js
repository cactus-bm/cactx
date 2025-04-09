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
  const combinedCashOnHand = companyA.cashOnHand + companyB.cashOnHand;
  const combinedArr = companyA.arr + companyB.arr;
  
  return {
    cashOnHand: combinedCashOnHand,
    arr: combinedArr
  };
};


/**
 * Perform valuation of the combined entity
 * @param {Object} combinedFinancials - Financial metrics of combined entity
 * @param {Object} scenario - Merger scenario configuration
 * @returns {Object} Valuation metrics
 */
export const calculateValuation = (combinedFinancials, scenario) => {
  const ownership = scenario.ownership
  // Get the company with the highest valuation to use as the source
  const valuationSource = Object.keys(scenario.valuation || {})
    .filter(key => key !== 'merger' && key !== 'cash')
    .reduce((highest, company) => 
      (scenario.valuation[company] > (scenario.valuation[highest] || 0)) ? company : highest, 
      'catx');
  const valuations = {}
    Object.entries(ownership).forEach(([company, percentage]) => {
      const v = scenario.valuation[valuationSource] / ownership[valuationSource] * percentage
      valuations[company] = { source: company, valuation: v }
    })

  valuations.merger = {
    source: valuationSource,
    valuation: scenario.valuation[valuationSource] / ownership[valuationSource] * 100
  }   
  valuations.cash = {
    source: 'cash',
    valuation: combinedFinancials.cashOnHand
  }
  return valuations;
};
