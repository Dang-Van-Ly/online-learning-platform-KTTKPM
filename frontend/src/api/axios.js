import axios from "axios";

// Kiểm tra xem đang chạy ở môi trường phát triển (development) hay không
const isDevelopment = import.meta.env.MODE === 'development';

// Nếu chạy local, trỏ thẳng về Gateway (8080). 
// Nếu bạn muốn test trực tiếp Chat Service mà không qua Gateway, hãy đổi thành 8085
const localBaseURL = "http://localhost:8080/api"; 

// Lấy từ file .env, nếu không có thì dùng localBaseURL
const baseURL = import.meta.env.VITE_API_BASE_URL || localBaseURL;

const api = axios.create({
    baseURL: baseURL.startsWith('http') ? baseURL : `${window.location.protocol}//${window.location.hostname}:8080${baseURL}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: ưu tiên token ở key `token`, fallback parse `user` nếu cần
api.interceptors.request.use((config) => {
    try {
        let token = localStorage.getItem("token");
        if (!token) {
            const user = localStorage.getItem("user");
            if (user) {
                try {
                    const parsed = JSON.parse(user);
                    token = parsed?.token;
                } catch (e) {
                    // ignore parse error
                }
            }
        }

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // fail silently
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor: xử lý token hết hạn (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Xóa token hết hạn khỏi localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // Chỉ redirect về login nếu đang ở trang cần auth (không phải trang public)
            const publicPaths = ["/", "/courses", "/login", "/register"];
            const isPublic = publicPaths.some(p => window.location.pathname === p || window.location.pathname.startsWith("/courses"));
            if (!isPublic) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
