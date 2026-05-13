import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Check localStorage for initial state if running in browser
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("stayease_user");
    if (storedUser) {
      try {
        return {
          user: JSON.parse(storedUser),
          isAuthenticated: true,
        };
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
  }
  return {
    user: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("stayease_user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("stayease_user");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
