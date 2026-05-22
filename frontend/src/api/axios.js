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

export default api;
