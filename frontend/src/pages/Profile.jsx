import { useContext, useState } from "react";
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

    const styles = {
        container: {
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            minHeight: "100vh",
            backgroundColor: "#f5f7fb",
            color: "#222",
        },
        wrapper: {
            maxWidth: "1200px",
            margin: "40px auto 80px",
            display: "grid",
            gridTemplateColumns: "250px 1fr",
            gap: "30px",
            padding: "0 24px",
        },
        sidebar: {
            display: "flex",
            flexDirection: "column",
            gap: "0",
        },
        sidebarItem: {
            padding: "16px 20px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            backgroundColor: "white",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            color: "#4b5563",
            marginBottom: "12px",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "12px",
        },
        sidebarItemHover: {
            backgroundColor: "#f3f4f6",
            borderColor: "#3b82f6",
            color: "#3b82f6",
        },
        mainContent: {
            display: "flex",
            flexDirection: "column",
            gap: "30px",
        },
        greeting: {
            backgroundColor: "white",
            padding: "40px 30px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
        greetingTitle: {
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "8px",
        },
        greetingSubtitle: {
            color: "#4b5563",
            fontSize: "14px",
            marginBottom: "20px",
        },
        greetingText: {
            fontSize: "14px",
            color: "#4b5563",
            lineHeight: "1.6",
        },
        greetingHighlight: {
            color: "#ff8c42",
            fontWeight: "600",
        },
        menuGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
        },
        menuCard: {
            backgroundColor: "white",
            padding: "40px 30px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
        menuCardHover: {
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            borderColor: "#ff8c42",
            transform: "translateY(-4px)",
        },
        menuCardTitle: {
            fontSize: "18px",
            fontWeight: "600",
            color: "#ff8c42",
        },
    };

    if (!user) {
        return (
            <div style={styles.container}>
                <Header />
                <div style={{padding: "80px 24px", textAlign: "center", color: "#4b5563"}}>
                    <h1>Bạn chưa đăng nhập</h1>
                    <p>Vui lòng đăng nhập để xem trang cá nhân.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        style={{
                            marginTop: "24px",
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
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

    const [hoveredSidebar, setHoveredSidebar] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <div style={styles.container}>
            <Header />
            <div style={styles.wrapper}>
                {/* Sidebar */}
                <div style={styles.sidebar}>
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                ...styles.sidebarItem,
                                ...(hoveredSidebar === item.id ? styles.sidebarItemHover : {}),
                            }}
                            onMouseEnter={() => setHoveredSidebar(item.id)}
                            onMouseLeave={() => setHoveredSidebar(null)}
                        >
                            <span>{item.icon}</span>
                            <span>{item.title}</span>
                        </div>
                    ))}
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: "16px 20px",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            backgroundColor: "white",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#dc2626",
                            marginTop: "12px",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#fee2e2";
                            e.target.style.borderColor = "#dc2626";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "white";
                            e.target.style.borderColor = "#e5e7eb";
                        }}
                    >
                        Đăng xuất
                    </button>
                </div>

                {/* Main Content */}
                <div style={styles.mainContent}>
                    {/* Greeting Section */}
                    <div style={styles.greeting}>
                        <div style={styles.greetingTitle}>
                            Xin chào <span style={styles.greetingHighlight}>{userName}</span> (không phải {userName}? <span style={{color: "#3b82f6", cursor: "pointer"}}>Đăng xuất</span>)
                        </div>
                        <p style={styles.greetingSubtitle}>
                            Từ bảng điều khiển tài khoản của bạn, bạn có thể xem các <span style={styles.greetingHighlight}>đơn hàng gần đây</span>, quản lý địa chỉ giao hàng và thanh toán của mình, và <span style={styles.greetingHighlight}>chỉnh sửa mật khẩu và chi tiết tài khoản</span>.
                        </p>
                    </div>

                    {/* Dashboard Grid */}
                    <div style={styles.menuGrid}>
                        {dashboardItems.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    ...styles.menuCard,
                                    ...(hoveredCard === item.id ? styles.menuCardHover : {}),
                                }}
                                onMouseEnter={() => setHoveredCard(item.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div style={styles.menuCardTitle}>{item.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
