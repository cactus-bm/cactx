import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companies: [
    {
      id: 'catx',
      name: 'CatX',
      financials: {
        revenue: 1000000,
        expenses: 750000,
        assets: 2000000,
        liabilities: 1000000,
      },
      metrics: {
        employees: 50,
        offices: 2,
        marketShare: 15,
      }
    },
    {
      id: 'cactus',
      name: 'Cactus',
      financials: {
        revenue: 1500000,
        expenses: 1200000,
        assets: 3000000,
        liabilities: 1800000,
      },
      metrics: {
        employees: 75,
        offices: 3,
        marketShare: 20,
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
