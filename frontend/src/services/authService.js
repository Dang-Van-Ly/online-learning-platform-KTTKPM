import axios from "axios";

const API_URL = "/auth";

export const register = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const verifyOtp = (email, otp, userData) => {
    return axios.post(`${API_URL}/verify-otp?email=${email}&otp=${otp}`, userData);
};

export const forgotPassword = (username, email) => {
    return axios.post(`${API_URL}/forgot-password?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`);
};

export const resetPassword = (email, otp, newPassword) => {
    return axios.post(
        `${API_URL}/reset-password?email=${encodeURIComponent(email)}&otp=${otp}&newPassword=${encodeURIComponent(newPassword)}`
    );
};
