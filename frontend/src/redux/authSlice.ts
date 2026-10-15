import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  /** Seeded "Try the demo" account (data resets nightly, some writes blocked). */
  isDemo?: boolean;
} | null;

type AuthState = {
  user: AuthUser;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: NonNullable<AuthUser>; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
