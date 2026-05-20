import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

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