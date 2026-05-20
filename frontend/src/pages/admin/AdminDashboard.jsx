import React from 'react';

export default function AdminDashboard() {
    // Dữ liệu mẫu
    const stats = [
        { title: "Tổng học viên", count: "1,250", icon: "👥", color: "#4e73df" },
        { title: "Khóa học đang bán", count: "48", icon: "📚", color: "#1cc88a" },
        { title: "Doanh thu tháng", count: "15.5tr", icon: "💰", color: "#36b9cc" },
        { title: "Yêu cầu hỗ trợ", count: "12", icon: "📩", color: "#f6c23e" }
    ];

    return (
        <div>
            <h2 style={{ marginBottom: '25px', color: '#333' }}>Bảng điều khiển quản trị</h2>

            {/* Khu vực các thẻ thống kê */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {stats.map((item, index) => (
                    <div key={index} style={{
                        padding: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        borderLeft: `5px solid ${item.color}`
                    }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: item.color, textTransform: 'uppercase' }}>
                            {item.title}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{item.count}</span>
                            <span style={{ fontSize: '30px' }}>{item.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Khu vực thông báo nhanh */}
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3>Hoạt động gần đây</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={listItemStyle}>🔔 User <b>nga_test</b> vừa đăng ký tài khoản mới.</li>
                    <li style={listItemStyle}>✅ Khóa học "Lập trình React" đã được duyệt thành công.</li>
                    <li style={listItemStyle}>⚠️ Hệ thống phát hiện 5 lượt đăng nhập thất bại từ IP lạ.</li>
                </ul>
            </div>
        </div>
    );
}

const listItemStyle = {
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    fontSize: '14px'
};