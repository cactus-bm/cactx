import { configureStore } from '@reduxjs/toolkit';
import scenariosReducer from './scenariosSlice';
import companiesReducer from './companiesSlice';

export const store = configureStore({
  reducer: {
    scenarios: scenariosReducer,
    companies: companiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
