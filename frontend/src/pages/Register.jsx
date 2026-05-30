import { useState } from "react";
import { register, verifyOtp } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { User, Mail, Lock, Phone, ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [errors, setErrors] = useState({}); // Lưu trữ lỗi validation và lỗi trùng lặp
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // --- 1. HÀM KIỂM TRA HỢP LỆ (FRONTEND VALIDATION) ---
    const validateForm = () => {
        let newErrors = {};

        // Username: từ 3 ký tự, chỉ chữ và số
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!username || username.length < 3) {
            newErrors.username = "Tên tài khoản phải từ 3 ký tự trở lên.";
        } else if (!usernameRegex.test(username)) {
            newErrors.username = "Tên tài khoản không được chứa dấu hoặc ký tự đặc biệt.";
        }

        // Email: đúng định dạng
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = "Email không hợp lệ (Ví dụ: abc@gmail.com).";
        }

        // Password: ít nhất 6 ký tự
        if (password.length < 6) {
            newErrors.password = "Mật khẩu bảo mật phải từ 6 ký tự.";
        }

        // Phone: chuẩn Việt Nam (10 số)
        const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
        if (phone && !phoneRegex.test(phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ (đủ 10 số).";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- 2. BƯỚC 1: GỬI THÔNG TIN & NHẬN OTP (CÓ CHECK TRÙNG) ---
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setErrors({}); // Xóa lỗi cũ

        try {
            await register({ username, email, password, phone });
            setIsOtpSent(true);
            alert("Hệ thống đã gửi mã OTP xác thực vào Email của bạn!");
        } catch (err) {
            const serverResponse = err.response?.data;

            // Kiểm tra mã lỗi trả về từ Backend để báo trùng
            if (serverResponse === "USERNAME_ALREADY_EXISTS") {
                setErrors({ username: "Tên đăng nhập này đã tồn tại trong hệ thống." });
            } else if (serverResponse === "EMAIL_ALREADY_EXISTS") {
                setErrors({ email: "Địa chỉ Email này đã được sử dụng." });
            } else {
                alert("Đăng ký thất bại: " + (serverResponse || "Lỗi máy chủ"));
            }
        } finally {
            setLoading(false);
        }
    };

    // --- 3. BƯỚC 2: XÁC THỰC OTP ---
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            alert("Vui lòng nhập đủ 6 chữ số mã OTP!");
            return;
        }
        setLoading(true);
        try {
            await verifyOtp(email, otp, { username, email, password, phone });
            alert("Xác thực thành công! Tài khoản của bạn đã được kích hoạt.");
            navigate("/login");
        } catch (err) {
            alert("Mã xác thực không chính xác hoặc đã hết hạn!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
            <Header />

            <div className="flex-grow flex items-center justify-center py-12 px-4">
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">

                    {/* Header Form */}
                    <div className="text-center mb-8">
                        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                            {isOtpSent ? <ShieldCheck className="text-blue-600" size={38} /> : <User className="text-blue-600" size={38} />}
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                            {isOtpSent ? "Xác nhận OTP" : "Đăng ký thành viên"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-2 font-medium">
                            {isOtpSent ? `Mã đã được gửi đến: ${email}` : "Trở thành hội viên để nhận ưu đãi khóa học"}
                        </p>
                    </div>

                    {!isOtpSent ? (
                        /* --- GIAO DIỆN NHẬP THÔNG TIN --- */
                        <form onSubmit={handleRegister} className="flex flex-col gap-5 text-left">
                            {/* Username */}
                            <div>
                                <label className="block text-[11px] font-black text-gray-500 uppercase mb-1.5 ml-1 tracking-wider">Tên tài khoản *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        className={`w-full border-2 py-3 pl-10 pr-4 rounded-2xl outline-none transition-all font-medium ${errors.username ? 'border-red-400 bg-red-50' : 'border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="Ví dụ: nguyenvana"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                {errors.username && <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1 font-bold"><AlertCircle size={12}/> {errors.username}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[11px] font-black text-gray-500 uppercase mb-1.5 ml-1 tracking-wider">Email liên hệ *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        className={`w-full border-2 py-3 pl-10 pr-4 rounded-2xl outline-none transition-all font-medium ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white'}`}
                                        type="email"
                                        placeholder="abc@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1 font-bold"><AlertCircle size={12}/> {errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[11px] font-black text-gray-500 uppercase mb-1.5 ml-1 tracking-wider">Mật khẩu *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        className={`w-full border-2 py-3 pl-10 pr-4 rounded-2xl outline-none transition-all font-medium ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white'}`}
                                        type="password"
                                        placeholder="Tối thiểu 6 ký tự"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1 font-bold"><AlertCircle size={12}/> {errors.password}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-[11px] font-black text-gray-500 uppercase mb-1.5 ml-1 tracking-wider">Số điện thoại</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        className={`w-full border-2 py-3 pl-10 pr-4 rounded-2xl outline-none transition-all font-medium ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="09xxx..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-[11px] mt-1.5 flex items-center gap-1 font-bold"><AlertCircle size={12}/> {errors.phone}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white p-4 rounded-2xl font-black uppercase text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 mt-4 flex items-center justify-center gap-2 disabled:bg-gray-300"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Gửi mã xác thực OTP"}
                            </button>
                        </form>
                    ) : (
                        /* --- GIAO DIỆN NHẬP MÃ OTP --- */
                        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <input
                                    className="border-2 border-blue-100 bg-gray-50 p-5 rounded-2xl text-center text-4xl font-black tracking-[12px] focus:border-blue-600 focus:bg-white outline-none transition-all shadow-inner"
                                    placeholder="000000"
                                    maxLength="6"
                                    autoFocus
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                                <p className="text-[11px] text-gray-400 text-center font-medium">Nhập 6 chữ số chúng tôi vừa gửi qua email của bạn</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 text-white p-4 rounded-2xl font-black uppercase text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Xác nhận & Hoàn tất"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsOtpSent(false)}
                                className="text-sm text-gray-400 font-bold hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <ArrowLeft size={16}/> Quay lại sửa thông tin
                            </button>
                        </form>
                    )}

                    {/* Footer link */}
                    <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-center">
                        <span className="text-gray-400 font-medium">Đã có tài khoản?</span>{" "}
                        <a href="/login" className="text-blue-600 font-black hover:underline ml-1">ĐĂNG NHẬP</a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}