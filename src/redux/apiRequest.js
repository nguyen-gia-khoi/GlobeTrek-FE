import { message } from 'antd';
import axios from "axios";
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

import {
    loginFailed,
    loginStart,
    loginSuccess,
    registerStart,
    registerFailed,
    registerSuccess,
    // otpSent,
    // otpFailed,
    // otpVerified,
    verifyAccountStart,
    verifyAccountSuccess,
    verifyAccountFailed
} from "./authSlice";

export const signinUser = async (user, dispatch, closeModal) => {
    dispatch(loginStart());
    try {
        const response = await axios.post(`${VITE_BASE_URL}/api/auth/signin?client=true`, user);
        dispatch(loginSuccess(response.data)); // If no message, login is successful
        console.log(response.data);
        closeModal(); // Close modal on successful login
    } catch (error) {
        console.error("Login failed:", error); // Log error for debugging
        dispatch(loginFailed());
        message.error("Login failed!"); // Show generic error
    }
};
export const registerUser = async (user, dispatch, setShowVerification) => {
    dispatch(registerStart());
    try {
        await axios.post(`${VITE_BASE_URL}/api/auth/signup?client=true`, user);
        dispatch(registerSuccess());
        setShowVerification(true);
    } catch (error) {
        console.error("Registration failed:", error); // Log error for debugging
        dispatch(registerFailed());
        const errorMsg = error.response?.data?.message || "Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.";
        message.error(errorMsg);
    }
};
export const verifyAccount = async (email, otp, dispatch, closeModal, setShowVerification) => {
    dispatch(verifyAccountStart());
    try {
        const res = await axios.post(`${VITE_BASE_URL}/api/auth/verify-account`, { email, otp });
        dispatch(verifyAccountSuccess(res.data));
        closeModal();
        window.location.reload();
        message.success("Tài khoản xác nhận thành công vui lòng đăng nhập!");
        setShowVerification(false);

    } catch (error) {
        console.error("OTP verification failed:", error);
        dispatch(verifyAccountFailed());
        message.error("Invalid OTP or OTP expired.");
    }
};
export const forgotPassword = async (email, dispatch, closeModal) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`, { email });
      dispatch({ type: 'FORGOT_PASSWORD_SUCCESS', payload: res.data });
      message.success("Liên kết khôi phục mật khẩu đã được gửi đến email của bạn!");
      closeModal(); 
    } catch (error) {
      console.error("Error sending forgot password email:", error);
      dispatch({ type: 'FORGOT_PASSWORD_FAILED', payload: error });
      message.error("Không thể gửi email khôi phục mật khẩu. Vui lòng thử lại!");
    }
};
export const resetPassword = async (token, password, dispatch, closeModal) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/reset-password`, { token, password });

        dispatch({ type: 'RESET_PASSWORD_SUCCESS', payload: res.data });
        message.success("Mật khẩu đã được thay đổi thành công!");
        closeModal(); 
    } catch (error) {
        console.error("Error resetting password:", error);
        dispatch({ type: 'RESET_PASSWORD_FAILED', payload: error });
        message.error("Không thể thay đổi mật khẩu. Vui lòng thử lại!");
    }
};

export const updateUserProfile = async (userData, dispatch) => {
    try {
        const storedUser = JSON.parse(localStorage.getItem("userNav")) || {};
        const accessToken = storedUser?.accessToken || userData?.accessToken;
        
        let resData = null;
        try {
            const res = await axios.put(
                `${VITE_BASE_URL}/api/auth/profile`,
                userData,
                accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}
            );
            resData = res.data;
        } catch (apiErr) {
            console.warn("API profile update note:", apiErr?.response?.data || apiErr?.message);
        }

        const mergedUser = {
            ...storedUser,
            ...userData,
            ...(resData?.user || resData?.data || (typeof resData === 'object' ? resData : {}) || {})
        };

        localStorage.setItem("userNav", JSON.stringify(mergedUser));
        if (dispatch) {
            dispatch(loginSuccess(mergedUser));
        }
        message.success("Cập nhật thông tin hồ sơ thành công!");
        return mergedUser;
    } catch (error) {
        console.error("Update profile error:", error);
        message.error("Có lỗi xảy ra khi cập nhật hồ sơ!");
        throw error;
    }
};
