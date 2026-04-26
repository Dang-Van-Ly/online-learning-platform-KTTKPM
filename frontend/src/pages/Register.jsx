import { useState } from "react";
import { register, verifyOtp } from "../services/authService"; // Đảm bảo đã thêm verifyOtp vào service
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(""); // Lưu mã OTP người dùng nhập
    const [isOtpSent, setIsOtpSent] = useState(false); // Trạng thái đã gửi OTP hay chưa

    const navigate = useNavigate();

    // Bước 1: Gửi thông tin để nhận mã OTP
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register({ username, email, password, phone });
            setIsOtpSent(true); // Chuyển sang bước nhập OTP
            alert("Mã OTP đã được gửi về email của bạn!");
        } catch (err) {
            const errorMsg = err.response?.data || "Lỗi hệ thống khi gửi OTP";
            alert("Đăng ký thất bại: " + errorMsg);
        }
    };

    // Bước 2: Gửi mã OTP để xác thực và tạo tài khoản chính thức
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            // Gọi API verify-otp với email, otp và toàn bộ data user
            await verifyOtp(email, otp, { username, email, password, phone });
            alert("Xác thực thành công! Tài khoản đã được tạo.");
            navigate("/login");
        } catch (err) {
            const errorMsg = err.response?.data || "Mã OTP không chính xác hoặc hết hạn";
            alert("Xác thực thất bại: " + errorMsg);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96 border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                    {isOtpSent ? "Verify OTP" : "Register"}
                </h2>

                {!isOtpSent ? (
                    /* FORM NHẬP THÔNG TIN BAN ĐẦU */
                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600">Username</label>
                            <input
                                className="border p-2 rounded focus:outline-blue-500"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600">Email</label>
                            <input
                                className="border p-2 rounded focus:outline-blue-500"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600">Password</label>
                            <input
                                className="border p-2 rounded focus:outline-blue-500"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                            <input
                                className="border p-2 rounded focus:outline-blue-500"
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition mt-2">
                            Send OTP
                        </button>
                    </form>
                ) : (
                    /* FORM NHẬP MÃ OTP */
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                        <p className="text-sm text-gray-500 text-center">
                            Vui lòng nhập mã 6 số đã được gửi tới <b>{email}</b>
                        </p>
                        <div className="flex flex-col">
                            <input
                                className="border-2 border-blue-400 p-3 rounded text-center text-2xl tracking-widest focus:outline-blue-600"
                                placeholder="000000"
                                maxLength="6"
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="bg-green-600 text-white p-2 rounded font-bold hover:bg-green-700 transition mt-2">
                            Confirm & Register
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOtpSent(false)}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Quay lại sửa thông tin
                        </button>
                    </form>
                )}

                <p className="mt-4 text-sm text-center">
                    Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
}