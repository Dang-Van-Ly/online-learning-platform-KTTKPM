import axios from "axios";

const api = axios.create({
    baseURL: "/api",
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
