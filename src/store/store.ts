// src/store/store.ts
// Redux store configuration — single source of truth for global state.

import { configureStore } from '@reduxjs/toolkit';
import { vehiclesReducer } from './vehiclesSlice';
import { driversReducer } from './driversSlice';
import { millsReducer } from './millsSlice';
import { tripsReducer } from './tripsSlice';
import { dashboardReducer } from './dashboardSlice';

export const store = configureStore({
  reducer: {
    vehicles: vehiclesReducer,
    drivers: driversReducer,
    mills: millsReducer,
    trips: tripsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
