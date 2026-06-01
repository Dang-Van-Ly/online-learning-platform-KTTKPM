import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminLayout() {
    const navigate = useNavigate();
    const { user, logoutUser } = useContext(AuthContext);

    useEffect(() => {
        const checkAuth = () => {
            const role = user?.role || JSON.parse(localStorage.getItem('user'))?.role;
            const currentRole = role?.toString().trim().toUpperCase();
            if (!currentRole || (currentRole !== 'ADMIN' && currentRole !== 'ROLE_ADMIN')) {
                alert("Bạn không có quyền truy cập trang quản trị!");
                navigate('/');
            }
        };
        checkAuth();
    }, [navigate, user]);

    const getNavLinkStyle = ({ isActive }) => ({
        color: "white", textDecoration: "none", fontSize: "16px", display: "block",
        padding: "12px 15px", borderRadius: "8px", marginBottom: "10px",
        backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "transparent",
        fontWeight: isActive ? "bold" : "normal", borderLeft: isActive ? "4px solid #fff" : "4px solid transparent"
    });

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
            {/* SIDEBAR */}
            <div style={{ width: "260px", backgroundColor: "#4e73df", color: "white", padding: "25px 15px" }}>
                <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>ADMIN PANEL</h2>
                <nav>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li><NavLink to="/admin" end style={getNavLinkStyle}>📊 Dashboard</NavLink></li>
                        <li><NavLink to="/admin/statistics" style={getNavLinkStyle}>📈 Thống kê chi tiết</NavLink></li>
                        <li><NavLink to="/admin/users" style={getNavLinkStyle}>👥 Quản lý Người dùng</NavLink></li>
                        <li><NavLink to="/admin/courses" style={getNavLinkStyle}>📁 Duyệt Khóa học</NavLink></li>
                        <li><NavLink to="/admin/orders" style={getNavLinkStyle}>🛒 Quản lý Đơn hàng</NavLink></li>

                        {/* ĐÃ CHÈN ĐỒNG BỘ NÚT KHUYẾN MÃI Ở ĐÂY NHA NGA */}
                        <li><NavLink to="/admin/promotions" style={getNavLinkStyle}>🎁 Quản lý Khuyến mãi</NavLink></li>

                        <hr style={{ border: '0.5px solid rgba(255,255,255,0.1)', margin: '30px 0' }} />
                        <li><NavLink to="/" style={{ color: 'white', opacity: 0.7 }}>🏠 Trang chủ</NavLink></li>
                    </ul>
                </nav>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ height: '70px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 40px' }}>
                    <button onClick={() => { logoutUser(); navigate("/login"); }} style={{ padding: '6px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Đăng xuất</button>
                </div>
                <div style={{ padding: "35px" }}><Outlet /></div>
            </div>
        </div>
    );
}