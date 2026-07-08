import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// const initialState: AuthState = {
//   user: null,
//   token: typeof window !== 'undefined' ? localStorage.getItem('brand-store-token') : null,
//   isAuthenticated: false,
//   isLoading: true,
// };

const token =
  typeof window !== "undefined"
    ? localStorage.getItem("brand-store-token")
    : null;

const initialState: AuthState = {
  user: null,
  token,
  isAuthenticated: !!token,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("brand-store-token", action.payload.token);
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("brand-store-token");
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, setUser, logout, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
