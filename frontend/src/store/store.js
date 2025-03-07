import { configureStore } from '@reduxjs/toolkit';
import farmerReducer from './slices/farmerSlice';

export const store = configureStore({
  reducer: {
    farmer: farmerReducer,
  },
}); 