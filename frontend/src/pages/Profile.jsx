import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseById } from "../api/courseApi";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
    const { user, logoutUser, purchasedCourseIds, membershipInfo, membershipHistory } = useContext(AuthContext);
    const [recentPurchasedCourses, setRecentPurchasedCourses] = useState([]);
    const [allPurchasedCourses, setAllPurchasedCourses] = useState([]);
    const [membershipUnlockedCourses, setMembershipUnlockedCourses] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
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
        if (!purchasedCourseIds?.length) {
            return;
        }

        const fetchPurchased = async () => {
            // Fetch tất cả khóa học đã mua
            const allItems = await Promise.all(
                purchasedCourseIds.map(async (courseId) => {
                    const course = await getCourseById(courseId);
                    return course ? { id: courseId, name: course.name } : null;
                })
            );
            const validItems = allItems.filter(Boolean);
            setAllPurchasedCourses(validItems);
            
            // Fetch 4 khóa học gần đây
            setRecentPurchasedCourses(validItems.slice(-4));
        };

        fetchPurchased();
    }, [purchasedCourseIds]);

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
                                    <p className="mt-2 font-semibold text-slate-900">{membershipInfo.title}</p>
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
