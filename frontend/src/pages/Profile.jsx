import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseById } from "../api/courseApi";
import api from "../api/axios";
import { changePassword } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
    const { user, logoutUser, purchasedCourseIds = [], favoriteCourseIds = [], removeFavoriteCourse, membershipInfo, membershipHistory } = useContext(AuthContext);
    const [recentPurchasedCourses, setRecentPurchasedCourses] = useState([]);
    const [allPurchasedCourses, setAllPurchasedCourses] = useState([]);
    const [favoriteCourses, setFavoriteCourses] = useState([]);
    const [membershipUnlockedCourses, setMembershipUnlockedCourses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [orderSelect, setOrderSelect] = useState({});
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [accountEmail, setAccountEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const handleMenuClick = (menuId) => {
        setSelectedMenu(menuId);
    };

    const handleViewCourse = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    useEffect(() => {
        if (!user) return;
        const fullName = user.fullName || user.name || user.username || "";
        const parts = fullName.trim().split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
        setDisplayName(user.displayName || fullName || user.username || "");
        setAccountEmail(user.email || "");
    }, [user]);

    const handleSaveProfileInfo = (e) => {
        e.preventDefault();
        setProfileMessage("");
        if (!firstName.trim() || !lastName.trim() || !displayName.trim() || !accountEmail.trim()) {
            setProfileMessage("Vui lòng điền đầy đủ các thông tin bắt buộc.");
            return;
        }
        setProfileMessage("Thông tin tài khoản đã được lưu thành công.");
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage("Vui lòng điền đầy đủ các trường mật khẩu.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage("Mật khẩu mới và xác nhận chưa khớp.");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage("Mật khẩu mới phải ít nhất 6 ký tự.");
            return;
        }
        if (!user?.userId) {
            setPasswordMessage("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        try {
            const response = await changePassword(user.userId, currentPassword, newPassword);
            setPasswordMessage(response.data || "Mật khẩu đã được đổi thành công.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            const backendMessage = error?.response?.data;
            setPasswordMessage(backendMessage || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        if (!purchasedCourseIds?.length) {
            setAllPurchasedCourses([]);
            setRecentPurchasedCourses([]);
            return;
        }

        const fetchPurchased = async () => {
            const allItems = await Promise.all(
                purchasedCourseIds.map(async (courseId) => {
                    const course = await getCourseById(courseId);
                    return course ? { id: courseId, name: course.name } : null;
                })
            );
            const validItems = allItems.filter(Boolean);
            setAllPurchasedCourses(validItems);
            setRecentPurchasedCourses(validItems.slice(-4));
        };

        fetchPurchased();
    }, [purchasedCourseIds]);

    useEffect(() => {
        if (!favoriteCourseIds?.length) {
            setFavoriteCourses([]);
            return;
        }

        const fetchFavorites = async () => {
            const allItems = await Promise.all(
                favoriteCourseIds.map(async (courseId) => {
                    const course = await getCourseById(courseId);
                    return course ? { id: courseId, name: course.name } : null;
                })
            );
            setFavoriteCourses(allItems.filter(Boolean));
        };

        fetchFavorites();
    }, [favoriteCourseIds]);

    useEffect(() => {
        if (!membershipInfo?.usedCourseIds?.length || membershipInfo.status !== "active") {
            setMembershipUnlockedCourses([]);
            return;
        }

        const fetchMembershipCourses = async () => {
            const items = await Promise.all(
                membershipInfo.usedCourseIds.map(async (courseId) => {
                    const course = await getCourseById(courseId);
                    return course ? { id: courseId, name: course.name } : null;
                })
            );
            setMembershipUnlockedCourses(items.filter(Boolean));
        };

        fetchMembershipCourses();
    }, [membershipInfo]);

    const userName = user?.fullName || user?.name || user?.username || user?.email || 'Tài khoản';

    const membershipExpirationText = membershipInfo
        ? (() => {
            const now = new Date();
            const expiresAt = new Date(membershipInfo.expiresAt);
            if (expiresAt <= now) return "Đã hết hạn";
            const diffMs = expiresAt - now;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return `${diffDays} ngày ${diffHours} giờ còn lại`;
        })()
        : null;

    const formatOrderStatus = (status) => {
        switch ((status || "").toString().toUpperCase()) {
            case "COMPLETED":
                return "Đã hoàn thành";
            case "PENDING":
                return "Đang xử lý";
            case "FAILED":
                return "Thanh toán thất bại";
            case "CANCELLED":
                return "Đã hủy";
            default:
                return status || "Chưa xác định";
        }
    };

    const loadUserOrders = async () => {
        if (!user?.userId) return;
        setOrdersLoading(true);
        try {
            const response = await api.get(`/orders/user/${user.userId}`);
            const orderData = response.data || [];
            const enrichedOrders = await Promise.all(
                orderData.map(async (order) => {
                    const items = await Promise.all(
                        (order.orderItems || []).map(async (item) => {
                            const course = item.courseId ? await getCourseById(item.courseId) : null;
                            return {
                                ...item,
                                courseName: course?.name || `Khóa học #${item.courseId}`,
                            };
                        })
                    );
                    return {
                        ...order,
                        orderItems: items,
                    };
                })
            );
            setOrders(enrichedOrders);
        } catch (error) {
            console.error("Error loading user orders:", error);
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    };

    useEffect(() => {
        if (selectedMenu === 4 && user?.userId) {
            loadUserOrders();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMenu, user?.userId]);

    const handleSelectCourse = (orderId, courseId) => {
        setOrderSelect((prev) => ({ ...prev, [orderId]: courseId }));
    };

    const handleGoToCourse = (order) => {
        const selectedCourseId = orderSelect[order.id] || order.orderItems?.[0]?.courseId;
        if (!selectedCourseId) {
            return;
        }
        navigate(`/course/${selectedCourseId}`);
    };

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
        { id: 2, title: `Khóa Học Đã Mua (${purchasedCourseIds?.length || 0})`, icon: "📚" },
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
                            onClick={() => handleMenuClick(item.id)}
                            className={`py-4 px-5 rounded-lg border text-sm font-medium mb-3 transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                                selectedMenu === item.id
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-blue-500 hover:text-blue-500"
                            }`}
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
                    {membershipInfo && (
                        <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm mb-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-4">Gói hội viên hiện tại</h2>
                            <div className="grid gap-3 sm:grid-cols-4">
                                <div className="rounded-3xl bg-white p-4">
                                    <p className="text-sm text-slate-500">Tên gói</p>
                                    <p className="mt-2 font-semibold text-slate-900">{membershipInfo.name || membershipInfo.title}</p>
                                </div>
                                <div className="rounded-3xl bg-white p-4">
                                    <p className="text-sm text-slate-500">Hiệu lực đến</p>
                                    <p className="mt-2 font-semibold text-slate-900">{new Date(membershipInfo.expiresAt).toLocaleDateString()}</p>
                                </div>
                                <div className="rounded-3xl bg-white p-4">
                                    <p className="text-sm text-slate-500">Thời gian còn lại</p>
                                    <p className="mt-2 font-semibold text-slate-900">{membershipExpirationText}</p>
                                </div>
                                <div className="rounded-3xl bg-white p-4">
                                    <p className="text-sm text-slate-500">Còn lại / Tổng</p>
                                    <p className="mt-2 font-semibold text-slate-900">{Math.max(0, membershipInfo.totalCourses - (membershipInfo.usedCourses || 0))} / {membershipInfo.totalCourses}</p>
                                </div>
                                <div className="rounded-3xl bg-white p-4">
                                    <p className="text-sm text-slate-500">Lượt hôm nay</p>
                                    <p className="mt-2 font-semibold text-slate-900">{membershipInfo.usedToday || 0} / {membershipInfo.dailyLimit}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedMenu === 1 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-2xl font-semibold text-slate-900">Khóa học mở theo hội viên</h2>
                                {membershipInfo ? (
                                    <div className="text-sm text-slate-600">
                                        Hiệu lực đến: <span className="font-semibold text-slate-900">{new Date(membershipInfo.expiresAt).toLocaleDateString()}</span>
                                        {membershipInfo.status !== 'active' ? " — Gói đã hết hạn" : ` — ${membershipExpirationText}`}
                                    </div>
                                ) : null}
                            </div>
                            <div className="mt-6">
                                {membershipInfo?.status !== 'active' ? (
                                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                                        Gói hội viên đã hết hạn, các khóa mở theo hội viên hiện không còn trong danh sách.
                                    </div>
                                ) : membershipUnlockedCourses.length > 0 ? (
                                    <div className="space-y-4">
                                        {membershipUnlockedCourses.map((course) => (
                                            <div
                                                key={course.id}
                                                onClick={() => handleViewCourse(course.id)}
                                                className="rounded-2xl border border-slate-200 p-5 bg-slate-50 cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <p className="text-base font-medium text-slate-900">{course.name}</p>
                                                    <p className="text-sm text-blue-600 font-semibold">Xem chi tiết →</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                                        Hiện bạn chưa mở khóa khóa học nào theo gói hội viên.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedMenu === 5 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
                            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Lịch sử gói hội viên đã mua</h2>
                            {membershipHistory?.length > 0 ? (
                                <div className="space-y-4">
                                    {membershipHistory.map((packageItem, index) => (
                                        <div key={`${packageItem.packageId}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                                <div>
                                                    <p className="text-base font-semibold text-slate-900">{packageItem.title} Membership</p>
                                                    <p className="text-sm text-slate-500">Mua ngày {new Date(packageItem.startedAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                    <p>Giá: {new Intl.NumberFormat('vi-VN').format(packageItem.price)}đ</p>
                                                    <p>Thời hạn: {packageItem.durationDays} ngày</p>
                                                    <p>Trạng thái: {packageItem.status === 'active' ? 'Đang hoạt động' : 'Đã hết hạn'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                                    Bạn chưa mua gói hội viên nào.
                                </div>
                            )}
                        </div>
                    )}

                    {selectedMenu === 6 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
                            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Đổi mật khẩu</h2>
                            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
                                <div className="space-y-6">
                                    <form onSubmit={handleSaveProfileInfo} className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tên *</label>
                                                <input
                                                    autoComplete="given-name"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                                                    placeholder="Tên"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Họ *</label>
                                                <input
                                                    autoComplete="family-name"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                                                    placeholder="Họ"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tên hiển thị *</label>
                                                <input
                                                    autoComplete="nickname"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                                                    placeholder="Tên hiển thị"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Địa chỉ email *</label>
                                                <input
                                                    type="email"
                                                    autoComplete="email"
                                                    value={accountEmail}
                                                    onChange={(e) => setAccountEmail(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                                                    placeholder="Email"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <button
                                                type="submit"
                                                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                                            >
                                                LƯU THAY ĐỔI
                                            </button>
                                            {profileMessage && (
                                                <p className="text-sm text-emerald-700">{profileMessage}</p>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">Bước tiếp theo</p>
                                            <p className="text-slate-600 text-sm">Sau khi lưu thông tin, bạn có thể thay đổi mật khẩu trong khung bên dưới.</p>
                                        </div>
                                        <form onSubmit={handleSavePassword} className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-slate-700 mb-2">Mật khẩu hiện tại</label>
                                                <input
                                                    type="password"
                                                    autoComplete="current-password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                                                    placeholder="Mật khẩu hiện tại"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-700 mb-2">Mật khẩu mới</label>
                                                <input
                                                    type="password"
                                                    autoComplete="new-password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                                                    placeholder="Mật khẩu mới"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-700 mb-2">Xác nhận mật khẩu mới</label>
                                                <input
                                                    type="password"
                                                    autoComplete="new-password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                                                    placeholder="Xác nhận mật khẩu mới"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                                            >
                                                LƯU MẬT KHẨU
                                            </button>
                                            {passwordMessage && (
                                                <p className="mt-3 text-sm text-emerald-700">{passwordMessage}</p>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedMenu === 3 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-900">Khóa Học Yêu Thích</h2>
                                    <p className="text-sm text-slate-600">Xem lại và quản lý danh sách khóa học bạn đã đánh dấu yêu thích.</p>
                                </div>
                                <div className="text-sm text-slate-500">Tổng: {favoriteCourses.length}</div>
                            </div>

                            {favoriteCourses.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                                    Bạn chưa có khóa học nào trong danh sách yêu thích.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {favoriteCourses.map((course) => (
                                        <div key={course.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div>
                                                    <p className="text-base font-medium text-slate-900">{course.name}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewCourse(course.id)}
                                                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                                                    >
                                                        Xem khóa học
                                                    </button>
                                                    <button
                                                        onClick={() => removeFavoriteCourse(course.id)}
                                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                                                    >
                                                        Bỏ yêu thích
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {selectedMenu === 4 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-900">Đơn hàng</h2>
                                    <p className="text-sm text-slate-600">Xem các đơn hàng đã hoàn tất và truy cập khóa học đã mua.</p>
                                </div>
                                <div className="text-sm text-slate-500">Tổng đơn hàng: {orders.length}</div>
                            </div>

                            {ordersLoading ? (
                                <div className="text-slate-600">Đang tải đơn hàng...</div>
                            ) : !orders.length ? (
                                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                                    Bạn chưa có đơn hàng nào.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                                        <thead className="bg-slate-50 text-slate-700">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">Đơn hàng</th>
                                                <th className="px-4 py-3 text-left font-medium">Ngày</th>
                                                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                                                <th className="px-4 py-3 text-left font-medium">Tổng</th>
                                                <th className="px-4 py-3 text-left font-medium">Ngân hàng</th>
                                                <th className="px-4 py-3 text-left font-medium">Hành động</th>
                                                <th className="px-4 py-3 text-left font-medium">Vào học</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {orders.map((order) => {
                                                const selectedCourse = orderSelect[order.id] || order.orderItems?.[0]?.courseId || "";
                                                return (
                                                    <tr key={order.id} className="hover:bg-slate-50">
                                                        <td className="px-4 py-4 font-semibold text-slate-900">#{order.id}</td>
                                                        <td className="px-4 py-4 text-slate-600">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</td>
                                                        <td className="px-4 py-4">
                                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                                {formatOrderStatus(order.status)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-900">{new Intl.NumberFormat('vi-VN').format(order.totalPrice || 0)}đ</td>
                                                        <td className="px-4 py-4 text-slate-600">{order.paymentMethod || "N/A"}</td>
                                                        <td className="px-4 py-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => alert(`Chi tiết đơn hàng #${order.id}`)}
                                                                className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition"
                                                            >
                                                                XEM
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="space-y-2">
                                                                <select
                                                                    value={selectedCourse}
                                                                    onChange={(e) => handleSelectCourse(order.id, e.target.value)}
                                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                                                                >
                                                                    <option value="">Chọn khóa học...</option>
                                                                    {order.orderItems?.map((item) => (
                                                                        <option key={item.courseId} value={item.courseId}>
                                                                            {item.courseName || `Khóa học #${item.courseId}`}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleGoToCourse(order)}
                                                                    disabled={!selectedCourse}
                                                                    className={`w-full rounded-lg px-3 py-2 text-sm font-semibold text-white transition ${selectedCourse ? 'bg-blue-500 hover:bg-blue-600' : 'bg-slate-300 cursor-not-allowed'}`}
                                                                >
                                                                    VÀO HỌC
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Hiển thị danh sách khóa học đã mua khi chọn menu item 2 */}
                    {selectedMenu === 2 && allPurchasedCourses.length > 0 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Tất cả khóa học đã mua ({allPurchasedCourses.length})</h2>
                            <div className="space-y-4">
                                {allPurchasedCourses.map((course) => (
                                    <div 
                                        key={course.id} 
                                        onClick={() => handleViewCourse(course.id)}
                                        className="rounded-2xl border border-slate-200 p-5 bg-slate-50 cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md"
                                    >
                                        <div className="flex justify-between items-center">
                                            <p className="text-base font-medium text-slate-900">{course.name}</p>
                                            <p className="text-sm text-blue-600 font-semibold">Xem chi tiết →</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hiển thị thông tin mặc định khi không chọn menu */}
                    {!selectedMenu && (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 mb-6">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-sm text-slate-500">Khóa học đã mua</p>
                                    <p className="mt-2 text-2xl font-semibold text-slate-900">{purchasedCourseIds?.length || 0}</p>
                                    <p className="mt-2 text-sm text-slate-600">Khóa học mới mua sẽ được mở khóa ngay sau khi thanh toán.</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-sm text-slate-500">Tình trạng học</p>
                                    <p className="mt-2 text-base text-slate-900">Bạn có thể xem lại các khóa học đã mua trong trang này.</p>
                                </div>
                            </div>
                            {recentPurchasedCourses.length > 0 && (
                                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm mb-6">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-3">Khóa học đã mua gần đây</h2>
                                    <div className="space-y-3">
                                        {recentPurchasedCourses.map((course) => (
                                            <div 
                                                key={course.id} 
                                                onClick={() => handleViewCourse(course.id)}
                                                className="rounded-2xl border border-slate-200 p-4 bg-slate-50 cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-400"
                                            >
                                                <p className="text-sm text-slate-500 hover:text-blue-600">{course.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
