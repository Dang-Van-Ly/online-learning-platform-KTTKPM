import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING'); // Lọc: PENDING hoặc ALL

    // --- STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    // 1. Lấy danh sách khóa học (Có tham số Page)
    const fetchCourses = async (page = 0) => {
        try {
            setLoading(true);
            // URL gọi theo filter và phân trang
            const endpoint = filter === 'PENDING' ? 'admin/courses/pending' : 'admin/courses';
            const response = await api.get(`${endpoint}?page=${page}&size=${pageSize}`);

            // Xử lý dữ liệu từ đối tượng Page của Spring Boot
            if (response.data && response.data.content) {
                setCourses(response.data.content);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.number);
            } else {
                setCourses([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    // Theo dõi thay đổi của Filter để reset về trang 0
    useEffect(() => {
        fetchCourses(0);
    }, [filter]);

    // 2. Thao tác: Phê duyệt (PENDING -> ACTIVE)
    const handleApprove = async (id) => {
        if (window.confirm("Xác nhận DUYỆT khóa học này lên hệ thống?")) {
            try {
                await api.put(`admin/courses/${id}/approve`);
                alert("Đã phê duyệt thành công!");
                fetchCourses(currentPage); // Tải lại trang hiện tại
            } catch (error) {
                alert("Lỗi khi duyệt khóa học.");
            }
        }
    };

    // 3. Thao tác: Từ chối (PENDING -> REJECTED)
    const handleReject = async (id) => {
        if (window.confirm("Xác nhận TỪ CHỐI khóa học này?")) {
            try {
                await api.put(`admin/courses/${id}/reject`);
                alert("Đã từ chối khóa học.");
                fetchCourses(currentPage);
            } catch (error) {
                alert("Lỗi khi từ chối.");
            }
        }
    };

    // 4. Thao tác: Xóa vĩnh viễn
    const handleDelete = async (id) => {
        if (window.confirm("Hành động này sẽ XÓA VĨNH VIỄN khóa học. Bạn chắc chắn chứ?")) {
            try {
                await api.delete(`admin/courses/${id}`);
                alert("Đã xóa khỏi hệ thống.");
                fetchCourses(currentPage);
            } catch (error) {
                alert("Lỗi khi xóa dữ liệu.");
            }
        }
    };

    if (loading && courses.length === 0) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải danh sách...</div>;

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={{ color: '#333', fontWeight: 'bold' }}>📁 Hệ thống Quản lý Khóa học</h2>
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
                    <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác quản trị</th>
                </tr>
                </thead>
                <tbody>
                {courses.length === 0 ? (
                    <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            Không có khóa học nào hiển thị.
                        </td>
                    </tr>
                ) : (
                    courses.map(course => (
                        <tr key={course.id} style={trStyle}>
                            <td style={tdStyle}>{course.id}</td>
                            <td style={{ ...tdStyle, fontWeight: '600', maxWidth: '300px' }}>{course.name}</td>
                            <td style={tdStyle}>{course.price?.toLocaleString()}đ</td>
                            <td style={tdStyle}>
                                <span style={statusBadgeStyle(course.status)}>
                                    {course.status === "PENDING" ? "⏳ Đang chờ" :
                                        course.status === "ACTIVE" ? "✅ Đã duyệt" : "❌ Từ chối"}
                                </span>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    {course.status === "PENDING" && (
                                        <>
                                            <button onClick={() => handleApprove(course.id)} style={btnStyle('#28a745')}>Duyệt</button>
                                            <button onClick={() => handleReject(course.id)} style={btnStyle('#ffc107')}>Từ chối</button>
                                        </>
                                    )}
                                    <button onClick={() => handleDelete(course.id)} style={btnStyle('#dc3545')}>Xóa</button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {/* --- PHÂN TRANG --- */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchCourses(page)}
            />
        </div>
    );
}

const containerStyle = { padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const tabGroupStyle = { display: 'flex', gap: '12px' };

const tabStyle = (active) => ({
    padding: '10px 20px', borderRadius: '8px', border: 'none',
    backgroundColor: active ? '#4e73df' : '#f1f5f9', color: active ? '#fff' : '#475569',
    cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s ease'
});

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '15px', color: '#4e73df', fontSize: '14px', fontWeight: 'bold' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #f1f5f9', color: '#5a5c69', fontSize: '14px', verticalAlign: 'middle' };
const trStyle = { transition: 'background-color 0.2s' };
const btnStyle = (color) => ({
    backgroundColor: color, color: '#fff', border: 'none',
    padding: '7px 14px', borderRadius: '6px', cursor: 'pointer',
    fontSize: '12px', fontWeight: 'bold', minWidth: '70px'
});

const statusBadgeStyle = (status) => ({
    padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
    backgroundColor: status === "ACTIVE" ? '#def7ec' : status === "PENDING" ? '#fef3c7' : '#fde2e1',
    color: status === "ACTIVE" ? '#03543f' : status === "PENDING" ? '#92400e' : '#9b1c1c'
});