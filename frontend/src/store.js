import { configureStore, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const generalSlice = createSlice({
  name: 'general',
  initialState: { loggedIn: false, role: null, error: null },
  reducers: {
    login: (state, action) => {
      state.role = action.payload.role;
      state.loggedIn = true;
      axios.defaults.headers.common['x-auth-token'] = action.payload.token;
    },
    logout: state => {
      state.loggedIn = false;
      delete axios.defaults.headers.common['x-auth-token'];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const store = configureStore({
  reducer: generalSlice.reducer,
});

export default store;

const { login, logout, setError } = generalSlice.actions;

export { login, logout, setError };
