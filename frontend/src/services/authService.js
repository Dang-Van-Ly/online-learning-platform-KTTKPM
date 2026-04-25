import axios from "axios";

// Đảm bảo BASE_URL là cổng của Spring Boot (thường là 8080)
const API_URL = "http://localhost:8080/auth";

export const register = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const verifyOtp = (email, otp, userData) => {
    // Truyền email và otp dưới dạng Query Params, userData dưới dạng Body
    return axios.post(`${API_URL}/verify-otp?email=${email}&otp=${otp}`, userData);
};