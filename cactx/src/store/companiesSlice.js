import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companies: [
    {
      id: 'catx',
      name: 'CatX',
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
            amount: 250000  // $250,000 invested
          },
          {
            name: 'Strategic Investor',
            amount: 350000  // $350,000 invested
          }
        ],
        employees: [
          {
            name: 'Option Pool',
            percentage: 0.10,  // 10% reserved for employees
            allocated: 0.04   // 4% already allocated
          },
          {
            name: 'John Smith (CTO)',
            percentage: 0.02  // 2% ownership
          },
          {
            name: 'Alice Johnson (VP Engineering)',
            percentage: 0.02  // 2% ownership
          }
        ]
      }
    },
    {
      id: 'cactus',
      name: 'Cactus',
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
            amount: 250000  // $250,000 invested
          },
          {
            name: 'Strategic Investor',
            amount: 350000  // $350,000 invested
          }
        ],
        employees: [
          {
            name: 'Option Pool',
            percentage: 0.10,  // 10% reserved for employees
            allocated: 0.04   // 4% already allocated
          },
          {
            name: 'John Smith (CTO)',
            percentage: 0.02  // 2% ownership
          },
          {
            name: 'Alice Johnson (VP Engineering)',
            percentage: 0.02  // 2% ownership
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
      state.companies = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  updateCompanyData,
  setCompanies,
  setLoading,
  setError,
} = companiesSlice.actions;

export const selectCompanies = (state) => state.companies.companies;
export const selectCompanyById = (state, id) => 
  state.companies.companies.find(company => company.id === id);
export const selectIsLoading = (state) => state.companies.isLoading;
export const selectError = (state) => state.companies.error;

export default companiesSlice.reducer;
