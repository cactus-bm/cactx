import { 
  calculateSplit, 
  convertSafeToEquity, 
  convertEmployeesToEquity,
  getEquitySummary
} from './equityCalculations';

describe('Equity Calculations', () => {
  // Test data
  const mockInvestors = {
    equity: [
      { name: 'Founder', percentage: 0.7 },
      { name: 'Angel', percentage: 0.2 }
    ],
    safe: [
      { name: 'SAFE Investor 1', amount: 500000, cap: 5000000 },
      { name: 'SAFE Investor 2', amount: 300000, cap: 6000000 }
    ],
    employees: [
      { name: 'Option Pool', allocated: 100 }
    ]
  };

  describe('calculateSplit', () => {
    test('should throw error for invalid inputs', () => {
      expect(() => calculateSplit(null, 1000000)).toThrow();
      expect(() => calculateSplit({}, 0)).toThrow();
      expect(() => calculateSplit({}, -1000)).toThrow();
    });

    test('should calculate equity split with all investor types', () => {
      const valuation = 10000000; // $10M
      const result = calculateSplit(mockInvestors, valuation);
      
      // Calculate expected values
      // Total equity: 0.7 + 0.2 = 0.9
      // SAFE conversions: 500k/5M (cap hit) = 0.1, 300k/10M = 0.03
      // Employee pool: 0.1 allocation (from utility assumption)
      // Total before normalization: 0.9 + 0.1 + 0.03 + 0.1 = 1.13
      // After normalization, each percentage is divided by 1.13
      
      expect(result).toHaveLength(5); // 2 equity + 2 safe + 1 employee investors
      
      // Find specific investors and check their percentages
      const founder = result.find(i => i.name === 'Founder');
      const safe1 = result.find(i => i.name === 'SAFE Investor 1');
      const employee = result.find(i => i.name === 'Option Pool');
      const safe2 = result.find(i => i.name === 'SAFE Investor 2');
      const angel = result.find(i => i.name === 'Angel');
      
      expect(founder).toBeDefined();
      expect(safe1).toBeDefined();
      expect(employee).toBeDefined();
      
      // Approximately 0.7/1.13 = 0.619
      expect(founder.percentage).toBeCloseTo(0.619, 3); 
      
      // SAFE 1 hits cap, so 0.1/1.13 = 0.0885
      expect(safe1.percentage).toBeCloseTo(0.0885, 3);
    });

    test('should handle empty investor categories', () => {
      const result = calculateSplit({
        equity: mockInvestors.equity,
        // No safe or employee investors
      }, 10000000);
      
      expect(result).toHaveLength(2); // Only equity investors
      
      // Total should be 0.7 + 0.2 = 0.9, normalized to 1.0
      const founder = result.find(i => i.name === 'Founder');
      expect(founder.percentage).toBeCloseTo(0.7/0.9, 5);
    });
  });

  describe('convertSafeToEquity', () => {
    test('should correctly convert SAFE investments to equity', () => {
      const valuation = 10000000; // $10M
      const result = convertSafeToEquity(mockInvestors.safe, valuation);
      
      expect(result).toHaveLength(2);
      
      // First SAFE hits cap at $5M
      expect(result[0].percentage).toBe(0.1); // 500k/5M = 0.1
      
      // Second SAFE uses valuation since cap is higher
      expect(result[1].percentage).toBe(0.03); // 300k/10M = 0.03
    });

    test('should handle no cap specified', () => {
      const safeWithoutCap = [
        { name: 'No Cap SAFE', amount: 1000000 } // No cap specified
      ];
      
      const valuation = 20000000;
      const result = convertSafeToEquity(safeWithoutCap, valuation);
      
      expect(result[0].percentage).toBe(0.05); // 1M/20M = 0.05
    });
  });

  describe('convertEmployeesToEquity', () => {
    test('should convert employee allocations to equity', () => {
      const result = convertEmployeesToEquity(mockInvestors.employees);
      
      expect(result).toHaveLength(1);
      expect(result[0].percentage).toBe(0.1); // 100% of the 10% allocation
    });

    test('should handle multiple employees with different allocations', () => {
      const employees = [
        { name: 'Employee 1', allocated: 60 },
        { name: 'Employee 2', allocated: 40 }
      ];
      
      const result = convertEmployeesToEquity(employees);
      
      expect(result).toHaveLength(2);
      expect(result[0].percentage).toBe(0.06); // (60/100) * 0.1 = 0.06
      expect(result[1].percentage).toBe(0.04); // (40/100) * 0.1 = 0.04
    });

    test('should handle empty employee list', () => {
      const result = convertEmployeesToEquity([]);
      expect(result).toEqual([]);
    });
  });

  describe('getEquitySummary', () => {
    test('should summarize equity distribution by type', () => {
      const equitySplit = [
        { name: 'Founder', type: 'equity', percentage: 0.6 },
        { name: 'Angel', type: 'equity', percentage: 0.2 },
        { name: 'SAFE 1', type: 'safe', percentage: 0.1 },
        { name: 'SAFE 2', type: 'safe', percentage: 0.05 },
        { name: 'Employee Pool', type: 'employee', percentage: 0.05 }
      ];
      
      const summary = getEquitySummary(equitySplit);
      
      expect(summary.equity).toBe(0.8);
      expect(summary.safe).toBe(0.15);
      expect(summary.employee).toBe(0.05);
    });
  });
});
