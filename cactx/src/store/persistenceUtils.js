// Utility functions for saving and loading application state from local storage

import store from './index';

const STORAGE_KEY = 'cactx-app-state';

// Save the entire Redux store state to local storage
export const saveStateToLocalStorage = () => {
  try {
    const state = store.getState();
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
    return true;
  } catch (error) {
    console.error('Error saving state:', error);
    return false;
  }
};

// Load state from local storage and apply it to the Redux store
export const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    
    if (!serializedState) {
      return { success: false, message: 'No saved state found.' };
    }
    
    const state = JSON.parse(serializedState);
    
    // Dispatch actions to update each slice with the loaded data
    if (state.companies) {
      store.dispatch({ type: 'companies/setCompanies', payload: state.companies.companies });
    }
    
    if (state.scenarios) {
      store.dispatch({ type: 'scenarios/setScenarios', payload: state.scenarios.scenarios });
    }
    
    return { success: true, message: 'State loaded successfully.' };
  } catch (error) {
    console.error('Error loading state:', error);
    return { success: false, message: `Error loading state: ${error.message}` };
  }
};

// Check if there is saved state available
export const hasSavedState = () => {
  return !!localStorage.getItem(STORAGE_KEY);
};
