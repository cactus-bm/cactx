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
  const valuations = {}
  const ownership = scenario.ownership
  
  if (scenario.valuation.catx > 0 || scenario.valuation.cactus > 0) {
    const valuationSource = scenario.valuation.catx > 0 ? 'catx' : 'cactus';

    valuations.merger = {
      source: valuationSource,
      valuation: scenario.valuation[valuationSource] / ownership[valuationSource] * (ownership.catx + ownership.cactus)
    }   
    valuations.ben = {
      source: valuationSource,
      valuation: scenario.valuation[valuationSource] / ownership[valuationSource] * ownership.ben
    }
    valuations.catx = {
      source: valuationSource,
      valuation: scenario.valuation[valuationSource] / ownership[valuationSource] * ownership.catx
    }
    valuations.cactus = {
      source: valuationSource,
      valuation: scenario.valuation[valuationSource] / ownership[valuationSource] * ownership.cactus
    }
    valuations.vested = {
      source: valuationSource,
      valuation: scenario.valuation[valuationSource] / ownership[valuationSource] * 100
    } 
  }
  valuations.cash = {
    source: 'cash',
    valuation: combinedFinancials.cashOnHand
  }
  return valuations;
};
