import { createSlice } from '@reduxjs/toolkit';

// Mock DB 
const initialUsers = [
  { id: 'u1', name: 'John Doe', email: 'john@college.edu', role: 'user', password: 'password123' },
  { id: 'a1', name: 'Admin Master', email: 'admin@college.edu', role: 'admin', password: 'admin' }
];

const initialState = {
  users: initialUsers,
  currentUser: null,
  isAuthenticated: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      const user = state.users.find(u => u.email === email && u.password === password);
      if (user) {
        state.currentUser = user;
        state.isAuthenticated = true;
        state.error = null;
      } else {
        state.error = 'Invalid email or password';
      }
    },
    register: (state, action) => {
      const { name, email, password } = action.payload;
      
      // Domain lock validation
      if (!email.endsWith('@college.edu')) {
        state.error = 'Registration restricted to @college.edu domain holders only.';
        return;
      }

      const existing = state.users.find(u => u.email === email);
      if (existing) {
        state.error = 'Email already registered';
        return;
      }

      const newUser = {
        id: `u${state.users.length + 1}`,
        name,
        email,
        password,
        role: 'user' // Everyone registers as a user initially
      };
      state.users.push(newUser);
      state.currentUser = newUser;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { login, register, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
