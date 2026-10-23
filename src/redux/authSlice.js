import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    register: {
      isFetching: false,
      error: false,
      success: false,
      otpSent: false,
      otpVerified: false,
    },
    verify: {
      isFetching: false,
      error: false,
      success: false,
    },
    forgotPassword: {
      isFetching: false,
      error: false,
      success: false,
    },
  },
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    logout: (state) => {
      state.login.currentUser = null;
      state.login.isFetching = false;
      state.login.error = false;
    },
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },
    otpSent: (state) => {
      state.register.otpSent = true;
    },
    otpFailed: (state) => {
      state.register.error = true;
    },
    otpVerified: (state) => {
      state.register.otpVerified = true;
    },
    verifyAccountStart: (state) => {
      state.verify.isFetching = true;
    },
    verifyAccountSuccess: (state) => {
      state.verify.isFetching = false;
      state.verify.success = true;
      state.verify.error = false;
    },
    verifyAccountFailed: (state) => {
      state.verify.isFetching = false;
      state.verify.error = true;
      state.verify.success = false;
    },
    forgotPasswordStart: (state) => {
      state.forgotPassword.isFetching = true;
      state.forgotPassword.success = false;
      state.forgotPassword.error = false;
    },
    forgotPasswordSuccess: (state) => {
      state.forgotPassword.isFetching = false;
      state.forgotPassword.success = true;
      state.forgotPassword.error = false;
    },
    forgotPasswordFailed: (state) => {
      state.forgotPassword.isFetching = false;
      state.forgotPassword.success = false;
      state.forgotPassword.error = true;
    },
    resetPasswordStart: (state) => {
      state.isResettingPassword = true;
    },
    resetPasswordSuccess: (state) => {
        state.isResettingPassword = false;
    },
    resetPasswordFailed: (state) => {
        state.isResettingPassword = false;
        state.error = "Password reset failed!";
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  logout,
  registerStart,
  registerSuccess,
  registerFailed,
  otpSent,
  otpFailed,
  otpVerified,
  verifyAccountStart,
  verifyAccountSuccess,
  verifyAccountFailed,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailed,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailed,
} = authSlice.actions;

export default authSlice.reducer;
