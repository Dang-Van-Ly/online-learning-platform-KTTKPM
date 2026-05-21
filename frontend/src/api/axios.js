import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

<<<<<<< HEAD
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
=======
// Thêm Interceptor để tự động gắn Token vào Header trước khi gửi request
api.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage (hoặc sessionStorage tùy dự án nhóm đang dùng)
        const token = localStorage.getItem("token");

        if (token) {
            // Gắn token vào header Authorization theo chuẩn Bearer
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
>>>>>>> origin/nga
