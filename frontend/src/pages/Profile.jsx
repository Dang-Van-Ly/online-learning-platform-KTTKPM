import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

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
        <div className="font-sans min-h-screen bg-[#f5f7fb] text-[#222]">
            <Header />
            <div className="max-w-[1200px] mx-auto mt-10 mb-20 grid grid-cols-[250px_1fr] gap-[30px] px-6">
                {/* Sidebar */}
                <div className="flex flex-col gap-0">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className="py-4 px-5 rounded-lg border border-gray-200 bg-white cursor-pointer text-sm font-medium text-gray-600 mb-3 transition-all duration-300 flex items-center gap-3 hover:bg-gray-100 hover:border-blue-500 hover:text-blue-500"
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
                </div>
            </div>
            <Footer />
        </div>
    );
}
