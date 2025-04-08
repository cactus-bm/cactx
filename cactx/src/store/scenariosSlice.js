import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scenarios: [],
  currentScenario: null,
  isLoading: false,
  error: null,
};

export const scenariosSlice = createSlice({
  name: 'scenarios',
  initialState,
  reducers: {
    setScenarios: (state, action) => {
      state.scenarios = action.payload;
    },
    addScenario: (state, action) => {
      state.scenarios.push(action.payload);
    },
    updateScenario: (state, action) => {
      const index = state.scenarios.findIndex(
        scenario => scenario.id === action.payload.id
      );
      if (index !== -1) {
        state.scenarios[index] = action.payload;
      }
    },
    deleteScenario: (state, action) => {
      state.scenarios = state.scenarios.filter(
        scenario => scenario.id !== action.payload.id
      );
    },
    setCurrentScenario: (state, action) => {
      state.currentScenario = action.payload;
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
  setScenarios,
  addScenario,
  updateScenario,
  deleteScenario,
  setCurrentScenario,
  setLoading,
  setError,
} = scenariosSlice.actions;

export const selectScenarios = (state) => state.scenarios.scenarios;
export const selectCurrentScenario = (state) => state.scenarios.currentScenario;
export const selectIsLoading = (state) => state.scenarios.isLoading;
export const selectError = (state) => state.scenarios.error;

export default scenariosSlice.reducer;
