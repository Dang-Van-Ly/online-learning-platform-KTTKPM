import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
    const { loginUser, loadUserData } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // 2. Khởi tạo navigate và location
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get("redirect") || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert("Username/password không được để trống");
            return;
        }
        try {
            const res = await api.post("/auth/login", {
                username: username.trim(),
                password: password.trim()
            });
            localStorage.setItem("token", res.data.token);

            const userData = {
                username: res.data.username,
                email: res.data.email || res.data.username,
                fullName: res.data.fullName || res.data.name || res.data.username,
                // Chuẩn hóa role về chữ hoa để so sánh không bị sai
                role: (res.data.role || res.data.roles || 'USER').toString().toUpperCase(),
                token: res.data.token,
                userId: res.data.userId,
            };

            // Lưu thông tin user vào context
            loginUser(userData);

            // Load purchased courses and membership data (nếu có)
            try {
                await loadUserData(userData.userId);
            } catch (e) {
                // Không block login nếu loadUserData lỗi
                console.warn("loadUserData failed:", e);
            }

            // 3. Chuyển hướng về trang tương ứng sau khi thành công
            alert("Đăng nhập thành công!");

            // Nếu có redirect query, ưu tiên chuyển hướng đó
            if (redirectPath && redirectPath !== "/") {
                navigate(redirectPath, { replace: true });
            } else if (typeof userData.role === 'string' && userData.role.includes("ADMIN")) {
                navigate("/admin");
            } else if (typeof userData.role === 'string' && userData.role.includes("INSTRUCTOR")) {
                navigate("/instructor");
            } else {
                navigate("/");
            }

        } catch (err) {
            console.error("Lỗi chi tiết:");
            console.log(err.response?.status); // Sẽ in ra 502
            console.log(err.response?.data);   // Xem backend có trả về thông báo gì không

            // Thông báo cho người dùng biết server đang có vấn đề
            if (err.response?.status === 502) {
                alert("Server Backend hiện không phản hồi (502). Vui lòng kiểm tra lại server!");
            } else {
                alert("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản!");
            }
        }
    };

    const styles = {
        container: {
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: "#f9f9f9",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            color: "#333"
        },
        // ... (Giữ nguyên các styles khác của bạn ở đây)
        pageTitle: {
            fontSize: "22px",
            fontWeight: "bold",
            padding: "20px 0 0 40px",
            margin: 0
        },
        formWrapper: {
            flex: "1 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 0"
        },
        card: {
            width: "90%",
            maxWidth: "380px",
            padding: "25px 30px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #eee",
            backgroundColor: "#fff"
        },
        formTitle: {
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "20px",
            textTransform: "uppercase",
            letterSpacing: "1px"
        },
        label: {
            display: "block",
            fontSize: "13px",
            marginBottom: "5px",
            color: "#666"
        },
        input: {
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
            outline: "none"
        },
        checkboxWrapper: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "15px",
            fontSize: "13px"
        },
        loginBtn: {
            width: "100%",
            padding: "12px",
            backgroundColor: "#2e6eef",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "10px"
        },
        forgotPass: {
            display: "block",
            textAlign: "center",
            color: "#2e6eef",
            textDecoration: "none",
            fontSize: "13px",
            marginBottom: "15px"
        },
        divider: {
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            margin: "15px 0",
            color: "#bbb",
            fontSize: "11px",
            fontWeight: "bold"
        },
        line: {
            flex: 1,
            height: "1px",
            backgroundColor: "#eee",
            margin: "0 10px"
        },
        registerBtn: {
            width: "100%",
            padding: "11px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer"
        }
    };

    return (
        <div style={styles.container}>
            {/* Nếu bạn muốn Header và Footer xuất hiện ở trang Login luôn: */}
            <Header />

            <h1 style={styles.pageTitle}>Tài khoản</h1>

            <div style={styles.formWrapper}>
                <div style={styles.card}>
                    <h2 style={styles.formTitle}>Đăng nhập</h2>

                    <form onSubmit={handleLogin}>
                        <label style={styles.label}>Tên tài khoản hoặc địa chỉ email *</label>
                        <input
                            style={styles.input}
                            type="text"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <label style={styles.label}>Mật khẩu *</label>
                        <div style={{ position: "relative" }}>
                            <input
                                style={styles.input}
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div style={styles.checkboxWrapper}>
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Ghi nhớ mật khẩu</label>
                        </div>

                        <button type="submit" style={styles.loginBtn}>Đăng nhập</button>
                    </form>

                    <a href="#" style={styles.forgotPass} onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}>Quên mật khẩu?</a>

                    <div style={styles.divider}>
                        <div style={styles.line}></div>
                        HOẶC
                        <div style={styles.line}></div>
                    </div>

                    <button
                        style={styles.registerBtn}
                        type="button"
                        onClick={() => navigate("/register")}
                    >
                        Đăng ký tài khoản
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}