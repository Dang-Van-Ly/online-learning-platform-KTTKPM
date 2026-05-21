import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING'); // Mặc định lọc các khóa PENDING (chữ)

    // 1. Lấy danh sách khóa học
    const fetchCourses = async () => {
        try {
            setLoading(true);
            // URL sẽ gọi đúng theo logic chuỗi PENDING
            const url = filter === 'PENDING' ? 'admin/courses/pending' : 'admin/courses';
            const response = await api.get(url);
            setCourses(response.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu từ Server:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [filter]);

    // 2. Phê duyệt khóa học (PENDING -> ACTIVE)
    const handleApprove = async (id) => {
        try {
            await api.put(`admin/courses/${id}/approve`);
            alert("Đã phê duyệt khóa học thành công!");
            fetchCourses();
        } catch (error) {
            alert("Thao tác thất bại. Vui lòng kiểm tra quyền hạn!");
        }
    };

    // 3. Từ chối khóa học (PENDING -> REJECTED)
    const handleReject = async (id) => {
        if (window.confirm("Xác nhận từ chối khóa học này?")) {
            try {
                await api.put(`admin/courses/${id}/reject`);
                fetchCourses();
            } catch (error) {
                alert("Không thể thực hiện thao tác.");
            }
        }
    };

    // 4. Xóa khóa học
    const handleDelete = async (id) => {
        if (window.confirm("Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?")) {
            try {
                await api.delete(`admin/courses/${id}`);
                fetchCourses();
            } catch (error) {
                alert("Lỗi khi xóa dữ liệu.");
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải danh sách...</div>;

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={{ color: '#333' }}>Hệ thống Quản lý Khóa học</h2>
                <div style={tabGroupStyle}>
                    <button
                        onClick={() => setFilter('PENDING')}
                        style={tabStyle(filter === 'PENDING')}
                    >
                        Đang chờ duyệt
                    </button>
                    <button
                        onClick={() => setFilter('ALL')}
                        style={tabStyle(filter === 'ALL')}
                    >
                        Tất cả khóa học
                    </button>
                </div>
            </div>

            <table style={tableStyle}>
                <thead>
                <tr style={{ backgroundColor: '#f4f7fe', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Tên khóa học</th>
                    <th style={thStyle}>Học phí</th>
                    <th style={thStyle}>Trạng thái</th>
                    <th style={thStyle}>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {courses.length === 0 ? (
                    <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                            Không có dữ liệu hiển thị.
                        </td>
                    </tr>
                ) : (
                    courses.map(course => (
                        <tr key={course.id} style={trStyle}>
                            <td style={tdStyle}>{course.id}</td>
                            <td style={{ ...tdStyle, fontWeight: '600' }}>{course.name}</td>
                            <td style={tdStyle}>{course.price?.toLocaleString()}đ</td>
                            <td style={tdStyle}>
                                    <span style={statusBadgeStyle(course.status)}>
                                        {course.status === "PENDING" ? "Đang chờ" :
                                            course.status === "ACTIVE" ? "Đã duyệt" : "Từ chối"}
                                    </span>
                            </td>
                            <td style={tdStyle}>
                                {course.status === "PENDING" && (
                                    <>
                                        <button onClick={() => handleApprove(course.id)} style={btnStyle('#28a745')}>Duyệt</button>
                                        <button onClick={() => handleReject(course.id)} style={btnStyle('#ffc107')}>Từ chối</button>
                                    </>
                                )}
                                <button onClick={() => handleDelete(course.id)} style={btnStyle('#dc3545')}>Xóa</button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

// --- Giao diện (CSS-in-JS) ---
const containerStyle = { padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const tabGroupStyle = { display: 'flex', gap: '12px' };

const tabStyle = (active) => ({
    padding: '10px 20px', borderRadius: '8px', border: 'none',
    backgroundColor: active ? '#4e73df' : '#f1f5f9', color: active ? '#fff' : '#475569',
    cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s ease'
});

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '15px', color: '#64748b', fontSize: '14px', fontWeight: 'bold' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '14px' };
const trStyle = { transition: 'background-color 0.2s' };
const btnStyle = (color) => ({ backgroundColor: color, color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontSize: '13px', fontWeight: '500' });

const statusBadgeStyle = (status) => ({
    padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
    backgroundColor: status === "ACTIVE" ? '#def7ec' : status === "PENDING" ? '#fef3c7' : '#fde2e1',
    color: status === "ACTIVE" ? '#03543f' : status === "PENDING" ? '#92400e' : '#9b1c1c'
});