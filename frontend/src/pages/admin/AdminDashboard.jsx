import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalRevenue: 0,
        userRoles: {},
        courseStatus: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (err) {
                console.error("Failed to load admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { 
            title: "Tổng học viên", 
            count: loading ? "..." : stats.totalUsers?.toLocaleString() || "0", 
            icon: "👥", 
            color: "#4e73df" 
        },
        { 
            title: "Khóa học đang bán", 
            count: loading ? "..." : stats.courseStatus?.["Đã duyệt"]?.toLocaleString() || "0", 
            icon: "📚", 
            color: "#1cc88a" 
        },
        { 
            title: "Tổng khóa học", 
            count: loading ? "..." : stats.totalCourses?.toLocaleString() || "0", 
            icon: "📖", 
            color: "#36b9cc" 
        },
        { 
            title: "Khóa học chờ duyệt", 
            count: loading ? "..." : stats.courseStatus?.["Đang chờ"]?.toLocaleString() || "0", 
            icon: "⏳", 
            color: "#f6c23e" 
        }
    ];

    return (
        <div>
            <h2 style={{ marginBottom: '25px', color: '#333' }}>Bảng điều khiển quản trị</h2>

            {/* Khu vực các thẻ thống kê */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {statCards.map((item, index) => (
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

            {/* Khu vực thống kê chi tiết */}
            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Thống kê theo vai trò */}
                <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3>Người dùng theo vai trò</h3>
                    {loading ? (
                        <p>Đang tải...</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {Object.entries(stats.userRoles || {}).map(([role, count]) => (
                                <li key={role} style={listItemStyle}>
                                    <strong>{role}:</strong> {count.toLocaleString()} người
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Thống kê khóa học theo trạng thái */}
                <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3>Khóa học theo trạng thái</h3>
                    {loading ? (
                        <p>Đang tải...</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {Object.entries(stats.courseStatus || {}).map(([status, count]) => (
                                <li key={status} style={listItemStyle}>
                                    <strong>{status}:</strong> {count.toLocaleString()} khóa
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Khu vực thông báo nhanh */}
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3>Hoạt động gần đây</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={listItemStyle}>🔔 Hệ thống đang hoạt động bình thường.</li>
                    <li style={listItemStyle}>✅ Dữ liệu đã được đồng bộ từ database.</li>
                    <li style={listItemStyle}>📊 Dashboard hiển thị dữ liệu thời gian thực.</li>
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