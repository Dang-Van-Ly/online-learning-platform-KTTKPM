import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import api from '../../api/axios'; // Đường dẫn đến file cấu hình axios của nhóm na

export default function AdminStatistics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Gọi API thống kê chi tiết từ Backend
                const response = await api.get('/admin/stats');
                setData(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu thống kê:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div style={{ padding: '30px', textAlign: 'center', fontSize: '18px' }}>Đang tổng hợp số liệu hệ thống...</div>;
    }

    if (!data) {
        return <div style={{ padding: '30px', textAlign: 'center', color: 'red' }}>Không thể tải dữ liệu thống kê. Vui lòng kiểm tra Backend!</div>;
    }

    // 📊 1. Chuẩn bị dữ liệu cho Biểu đồ Tròn (Cơ cấu người dùng)
    const userData = [
        { name: 'Học viên', value: data.userRoles?.['Học viên'] || 0 },
        { name: 'Giảng viên', value: data.userRoles?.['Giảng viên'] || 0 },
        { name: 'Quản trị', value: data.userRoles?.['Quản trị'] || 0 }
    ];
    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    // 📊 2. Chuẩn bị dữ liệu cho Biểu đồ Cột (Trạng thái khóa học)
    const courseData = [
        { name: 'Đã duyệt', số_lượng: data.courseStatus?.['Đã duyệt'] || 0 },
        { name: 'Đang chờ', số_lượng: data.courseStatus?.['Đang chờ'] || 0 },
        { name: 'Từ chối', số_lượng: data.courseStatus?.['Từ chối'] || 0 }
    ];

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
            <h2 style={{ color: '#333', marginBottom: '30px', fontWeight: 'bold' }}>📊 Báo Cáo Thống Kê Hệ Thống</h2>

            {/* Khu vực Biểu đồ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>

                {/* BIỂU ĐỒ TRÒN */}
                <div style={cardStyle}>
                    <h3 style={cardTitle}>Cơ cấu Thành viên</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={userData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label>
                                    {userData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* BIỂU ĐỒ CỘT */}
                <div style={cardStyle}>
                    <h3 style={cardTitle}>Tình trạng Khóa học</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={courseData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="số_lượng" fill="#4e73df" radius={[8, 8, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* BẢNG TỔNG KẾT NHANH */}
            <div style={{ ...cardStyle, marginTop: '30px' }}>
                <h3 style={{ ...cardTitle, color: '#1cc88a' }}>📋 Tóm tắt vận hành</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '15px' }}>
                    <div style={subCardStyle}>
                        <span style={labelStyle}>Tổng số thành viên</span>
                        <strong style={numberStyle}>{data.totalUsers}</strong>
                    </div>
                    <div style={subCardStyle}>
                        <span style={labelStyle}>Tổng số khóa học</span>
                        <strong style={numberStyle}>{data.totalCourses}</strong>
                    </div>
                    <div style={subCardStyle}>
                        <span style={labelStyle}>Khóa học chờ duyệt</span>
                        <strong style={{ ...numberStyle, color: '#f6c23e' }}>{data.courseStatus?.['Đang chờ'] || 0}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

// === THÀNH PHẦN STYLES ===
const cardStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const cardTitle = { fontSize: '18px', color: '#4e73df', marginBottom: '20px', fontWeight: '600' };
const subCardStyle = { display: 'flex', flexDirection: 'column', padding: '15px', backgroundColor: '#f8f9fc', borderRadius: '10px', borderLeft: '4px solid #4e73df' };
const labelStyle = { fontSize: '13px', color: '#858796', textTransform: 'uppercase', marginBottom: '5px' };
const numberStyle = { fontSize: '24px', fontWeight: 'bold', color: '#5a5c69' };