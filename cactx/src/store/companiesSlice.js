import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companies: [
    {
      id: 'company_a',
      name: 'Company A',
      cashOnHand: 800000,
      arr: 250000,
      metrics: {
        employees: 50,
        offices: 2,
        marketShare: 15,
      },
      investors: {
        equity: [
          {
            name: 'Founder',
            percentage: 0.65  // 65% ownership
          },
          {
            name: 'Angel Investor',
            percentage: 0.15  // 15% ownership
          },
          {
            name: 'Seed Fund',
            percentage: 0.20  // 20% ownership
          }
        ],
        safe: [
          {
            name: 'Growth Capital',
            amount: 250000,  // $250,000 invested
            cap: 5000000    // $5M valuation cap
          },
          {
            name: 'Strategic Investor',
            amount: 350000,  // $350,000 invested
            cap: 7500000    // $7.5M valuation cap
          }
        ],
        employees: [
          {
            name: 'Option Pool',
            allocated: 75   // 75 RSUs
          },
        ]
      }
    },
    {
      id: 'company_b',
      name: 'Company B',
      cashOnHand: 950000,
      arr: 320000,
      metrics: {
        employees: 75,
        offices: 3,
        marketShare: 20,
      },
      investors: {
        equity: [
          {
            name: 'Angel Investor',
            percentage: 0.15  // 15% ownership
          },
          {
            name: 'Seed Fund',
            percentage: 0.20  // 20% ownership
          }
        ],
        safe: [
          {
            name: 'Growth Capital',
            amount: 250000,  // $250,000 invested
            cap: 5000000    // $5M valuation cap
          },
          {
            name: 'Strategic Investor',
            amount: 350000,  // $350,000 invested
            cap: 7500000    // $7.5M valuation cap
          }
        ],
        employees: [
          {
            name: 'Option Pool',
            allocated: 75   // 75 RSUs
          }
        ]
      }
    }
  ],
  isLoading: false,
  error: null,
};

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    updateCompanyData: (state, action) => {
      const { id, data } = action.payload;
      const companyIndex = state.companies.findIndex(company => company.id === id);
      if (companyIndex !== -1) {
        state.companies[companyIndex] = { 
          ...state.companies[companyIndex], 
          ...data 
        };
      }
    },
    setCompanies: (state, action) => {
      // This action replaces the entire companies array with the provided payload
      // Used for loading saved state from local storage
      state.companies = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addCompany: (state, action) => {
      // Add a new company to the companies array
      state.companies.push(action.payload);
    },
    updateCompanyName: (state, action) => {
      const { companyId, newName } = action.payload;
      const companyToUpdate = state.companies.find(company => company.id === companyId);
      if (companyToUpdate) {
        companyToUpdate.name = newName;
      }
    },
  },
});

export const {
  updateCompanyData,
  setCompanies,
  setLoading,
  setError,
  addCompany,
  updateCompanyName
} = companiesSlice.actions;

export const selectCompanies = (state) => state.companies.companies;
export const selectCompanyById = (state, id) => 
  state.companies.companies.find(company => company.id === id);
export const selectIsLoading = (state) => state.companies.isLoading;
export const selectError = (state) => state.companies.error;

export default companiesSlice.reducer;
