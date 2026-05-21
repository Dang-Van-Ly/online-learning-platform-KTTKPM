import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
    const user = localStorage.getItem("user");
    if (user) {
        try {
            const userData = JSON.parse(user);
            if (userData.token) {
                config.headers.Authorization = `Bearer ${userData.token}`;
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
