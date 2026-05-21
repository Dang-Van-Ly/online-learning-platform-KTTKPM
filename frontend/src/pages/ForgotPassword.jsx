import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../services/authService";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: nhập username + email, 2: nhập OTP + mật khẩu mới
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Bước 1: Gửi OTP về email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!username.trim() || !email.trim()) {
            alert("Vui lòng nhập đầy đủ tên tài khoản và email!");
            return;
        }
        setLoading(true);
        try {
            await forgotPassword(username.trim(), email.trim());
            alert("Mã OTP đã được gửi về email của bạn!");
            setStep(2);
        } catch (err) {
            const errorMsg = err.response?.data || "Lỗi hệ thống, vui lòng thử lại!";
            alert("Thất bại: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Bước 2: Xác nhận OTP và đặt lại mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            alert("Vui lòng nhập mã OTP!");
            return;
        }
        if (newPassword.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        setLoading(true);
        try {
            await resetPassword(email.trim(), otp.trim(), newPassword);
            alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
            navigate("/login");
        } catch (err) {
            const errorMsg = err.response?.data || "Mã OTP sai hoặc hết hạn!";
            alert("Thất bại: " + errorMsg);
        } finally {
            setLoading(false);
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
            maxWidth: "400px",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            border: "1px solid #eee",
            backgroundColor: "#fff"
        },
        formTitle: {
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "1px"
        },
        subtitle: {
            textAlign: "center",
            fontSize: "13px",
            color: "#888",
            marginBottom: "24px"
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
            marginBottom: "14px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
            outline: "none"
        },
        otpInput: {
            width: "100%",
            padding: "12px",
            marginBottom: "14px",
            border: "2px solid #2e6eef",
            borderRadius: "6px",
            fontSize: "22px",
            textAlign: "center",
            letterSpacing: "8px",
            boxSizing: "border-box",
            outline: "none"
        },
        primaryBtn: {
            width: "100%",
            padding: "12px",
            backgroundColor: "#2e6eef",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "12px"
        },
        backLink: {
            display: "block",
            textAlign: "center",
            color: "#2e6eef",
            textDecoration: "none",
            fontSize: "13px",
            cursor: "pointer",
            background: "none",
            border: "none",
            width: "100%"
        },
        emailHighlight: {
            textAlign: "center",
            fontSize: "13px",
            color: "#555",
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#f0f4ff",
            borderRadius: "6px"
        }
    };

    return (
        <div style={styles.container}>
            <Header />

            <h1 style={styles.pageTitle}>Tài khoản</h1>

            <div style={styles.formWrapper}>
                <div style={styles.card}>
                    {step === 1 ? (
                        <>
                            <h2 style={styles.formTitle}>Quên mật khẩu</h2>
                            <p style={styles.subtitle}>
                                Nhập tên tài khoản và email đã đăng ký để nhận mã OTP.
                            </p>

                            <form onSubmit={handleSendOtp}>
                                <label style={styles.label}>Tên tài khoản *</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="Nhập tên tài khoản"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />

                                <label style={styles.label}>Địa chỉ email *</label>
                                <input
                                    style={styles.input}
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <button
                                    type="submit"
                                    style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
                                    disabled={loading}
                                >
                                    {loading ? "Đang gửi..." : "Gửi mã OTP"}
                                </button>
                            </form>

                            <button
                                style={styles.backLink}
                                onClick={() => navigate("/login")}
                            >
                                ← Quay lại đăng nhập
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 style={styles.formTitle}>Đặt lại mật khẩu</h2>
                            <div style={styles.emailHighlight}>
                                Mã OTP đã gửi tới <strong>{email}</strong>
                            </div>

                            <form onSubmit={handleResetPassword}>
                                <label style={styles.label}>Mã OTP (6 số) *</label>
                                <input
                                    style={styles.otpInput}
                                    type="text"
                                    placeholder="000000"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />

                                <label style={styles.label}>Mật khẩu mới *</label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    placeholder="Tối thiểu 6 ký tự"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />

                                <label style={styles.label}>Xác nhận mật khẩu mới *</label>
                                <input
                                    style={styles.input}
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="submit"
                                    style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
                                    disabled={loading}
                                >
                                    {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                                </button>
                            </form>

                            <button
                                style={styles.backLink}
                                onClick={() => setStep(1)}
                            >
                                ← Đổi thông tin khác
                            </button>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
