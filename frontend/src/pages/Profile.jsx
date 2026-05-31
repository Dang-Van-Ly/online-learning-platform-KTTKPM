import { useContext, useState } from "react"; // Thêm useState
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/axios"; // Đảm bảo đường dẫn này đúng với file axios.js của bạn

export default function Profile() {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- CHỨC NĂNG THÊM MỚI ---
    const [activeTab, setActiveTab] = useState("DASHBOARD"); // Quản lý nội dung hiển thị
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Mật khẩu mới không khớp!");
            return;
        }
        try {
            await api.put(`/users/${user.id}/change-password`, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            alert("Đổi mật khẩu thành công!");
            setActiveTab("DASHBOARD");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.log("Lỗi chi tiết:", err.response?.data);
            // Lấy message từ Backend trả về
            const message = err.response?.data?.message || err.response?.data || "Mật khẩu cũ không chính xác!";
            alert(typeof message === 'object' ? "Lỗi hệ thống!" : message);
        }
    };
    // --------------------------

    const userName = user?.fullName || user?.name || user?.username || user?.email || 'Tài khoản';

    if (!user) {
        return (
            <div className="font-sans min-h-screen bg-[#f5f7fb] text-[#222]">
                <Header />
                <div className="py-20 px-6 text-center text-gray-600">
                    <h1 className="text-3xl font-bold mb-4">Bạn chưa đăng nhập</h1>
                    <p>Vui lòng đăng nhập để xem trang cá nhân.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-6 px-6 py-3 rounded-lg border-none bg-blue-500 text-white cursor-pointer font-semibold hover:bg-blue-600 transition-colors"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const menuItems = [
        { id: 1, title: "Khóa Học Hội Viên", icon: "👤" },
        { id: 2, title: "Khóa Học Đã Mua", icon: "📚" },
        { id: 3, title: "Khóa Học Yêu Thích", icon: "❤️" },
        { id: 4, title: "Đơn Hàng", icon: "📋" },
        { id: 5, title: "Gói Hội Viên", icon: "🎁" },
        { id: 6, title: "Đổi Mật Khẩu", icon: "🔒" },
    ];

    const dashboardItems = [
        { id: 1, title: "Memberships" },
        { id: 2, title: "Đơn hàng" },
        { id: 3, title: "Tập tài xương" },
        { id: 4, title: "Địa chỉ" },
        { id: 5, title: "Tài khoản" },
        { id: 6, title: "Wishlist" },
    ];

    return (
        <div className="font-sans min-h-screen bg-[#f5f7fb] text-[#222] text-left">
            <Header />
            <div className="max-w-[1200px] mx-auto mt-10 mb-20 grid grid-cols-[250px_1fr] gap-[30px] px-6">
                {/* Sidebar */}
                <div className="flex flex-col gap-0">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => item.title === "Đổi Mật Khẩu" ? setActiveTab("PASSWORD") : setActiveTab("DASHBOARD")}
                            className={`py-4 px-5 rounded-lg border border-gray-200 bg-white cursor-pointer text-sm font-medium text-gray-600 mb-3 transition-all duration-300 flex items-center gap-3 hover:bg-gray-100 hover:border-blue-500 hover:text-blue-500 ${activeTab === "PASSWORD" && item.title === "Đổi Mật Khẩu" ? "border-blue-500 text-blue-500 shadow-sm" : ""}`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.title}</span>
                        </div>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="py-4 px-5 rounded-lg border border-gray-200 bg-white cursor-pointer text-sm font-medium text-red-600 mt-3 transition-all duration-300 hover:bg-red-100 hover:border-red-600 text-left"
                    >
                        Đăng xuất
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex flex-col gap-[30px]">
                    {activeTab === "DASHBOARD" ? (
                        <>
                            {/* Greeting Section */}
                            <div className="bg-white py-10 px-[30px] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                                <div className="text-2xl font-bold mb-2">
                                    Xin chào <span className="text-[#ff8c42] font-semibold">{userName}</span> (không phải {userName}? <span className="text-blue-500 cursor-pointer" onClick={handleLogout}>Đăng xuất</span>)
                                </div>
                                <p className="text-gray-600 text-sm mb-5">
                                    Từ bảng điều khiển tài khoản của bạn, bạn có thể xem các <span className="text-[#ff8c42] font-semibold">đơn hàng gần đây</span>, quản lý địa chỉ giao hàng và thanh toán của mình, và <span className="text-[#ff8c42] font-semibold">chỉnh sửa mật khẩu và chi tiết tài khoản</span>.
                                </p>
                            </div>

                            {/* Dashboard Grid */}
                            <div className="grid grid-cols-3 gap-6">
                                {dashboardItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white py-10 px-[30px] rounded-xl border border-gray-200 text-center cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-[#ff8c42] hover:-translate-y-1"
                                    >
                                        <div className="text-lg font-semibold text-[#ff8c42]">{item.title}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white py-10 px-8 lg:px-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <div className="mb-8 border-b border-gray-100 pb-5">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                    <span className="text-[#ff8c42] text-3xl">🔒</span> Đổi Mật Khẩu
                                </h2>
                                <p className="text-gray-500 text-sm mt-2">Đảm bảo tài khoản của bạn được bảo mật bằng một mật khẩu mạnh và duy nhất.</p>
                            </div>

                            <form onSubmit={handleChangePassword} className="flex flex-col gap-6">
                                {/* Mật khẩu cũ (Full width) */}
                                <div className="relative max-w-lg">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Mật khẩu hiện tại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password" required
                                        placeholder="Nhập mật khẩu hiện tại"
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-4 focus:ring-[#ff8c42]/15 focus:border-[#ff8c42] focus:bg-white block p-4 outline-none transition-all duration-300"
                                        onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                        value={passwordData.oldPassword}
                                    />
                                </div>

                                {/* Cụm Mật khẩu mới (Chia 2 cột trên màn hình lớn) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Mật khẩu mới <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password" required
                                            placeholder="Nhập mật khẩu mới"
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-4 focus:ring-[#ff8c42]/15 focus:border-[#ff8c42] focus:bg-white block p-4 outline-none transition-all duration-300"
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            value={passwordData.newPassword}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Xác nhận mật khẩu <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password" required
                                            placeholder="Nhập lại mật khẩu mới"
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-4 focus:ring-[#ff8c42]/15 focus:border-[#ff8c42] focus:bg-white block p-4 outline-none transition-all duration-300"
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            value={passwordData.confirmPassword}
                                        />
                                    </div>
                                </div>

                                {/* Buttons container */}
                                <div className="flex items-center gap-4 mt-4 pt-6 border-t border-gray-100 max-w-3xl">
                                    <button
                                        type="submit"
                                        className="bg-[#ff8c42] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#e67e35] hover:shadow-lg hover:shadow-[#ff8c42]/30 transition-all duration-300 active:scale-95 flex items-center gap-2"
                                    >
                                        <span>Lưu thay đổi</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("DASHBOARD")}
                                        className="bg-gray-50 text-gray-600 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 hover:text-gray-800 transition-all duration-300 active:scale-95"
                                    >
                                        Hủy bỏ
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}