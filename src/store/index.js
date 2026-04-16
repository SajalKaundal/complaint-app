import { configureStore } from '@reduxjs/toolkit';
import complaintReducer from './complaintSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    complaints: complaintReducer,
    auth: authReducer,
  },
});
