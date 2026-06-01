import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState('STUDENT'); // STUDENT hoặc INSTRUCTOR
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const loadUsers = async (role, pageNum = 0) => {
        setLoading(true);
        setUsers([]);
        try {
            const endpoint = role === 'STUDENT' ? '/admin/users/students' : '/admin/users/instructors';
            // Gọi API với phân trang
            const response = await api.get(`${endpoint}?page=${pageNum}&size=${pageSize}`);

            if (response.data && response.data.content) {
                setUsers(response.data.content);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.number);
            }
        } catch (error) {
            console.error("Lỗi tải người dùng:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Tự động load khi đổi Tab hoặc Trang
    useEffect(() => {
        loadUsers(activeTab, currentPage);
    }, [activeTab, currentPage]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(0); // Chuyển tab thì về trang đầu
    };

    const handleToggleBlock = async (userId, currentStatus) => {
        const actionText = currentStatus === 'Active' ? "KHÓA" : "MỞ KHÓA";
        if (window.confirm(`Xác nhận ${actionText} tài khoản này?`)) {
            try {
                await api.put(`/admin/users/${userId}/toggle-status`);
                alert("Cập nhật trạng thái thành công!");
                loadUsers(activeTab, currentPage);
            } catch (error) {
                alert("Thao tác thất bại!");
            }
        }
    };

    if (loading && users.length === 0) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải dữ liệu...</div>;

    return (
        <div style={containerStyle}>
            {/* Tiêu đề & Tab */}
            <div style={headerStyle}>
                <h2 style={{ color: '#333', fontWeight: 'bold', margin: 0 }}>👤 Quản Lý Người Dùng</h2>
                <div style={tabGroupStyle}>
                    <button
                        onClick={() => handleTabChange('STUDENT')}
                        style={tabStyle(activeTab === 'STUDENT')}
                    >
                        👨‍🎓 Học viên
                    </button>
                    <button
                        onClick={() => handleTabChange('INSTRUCTOR')}
                        style={tabStyle(activeTab === 'INSTRUCTOR')}
                    >
                        👨‍🏫 Giảng viên
                    </button>
                </div>
            </div>

            {/* Bảng danh sách */}
            <table style={tableStyle}>
                <thead>
                <tr style={{ backgroundColor: '#f4f7fe', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Thông tin tài khoản</th>
                    <th style={thStyle}>Liên hệ</th>
                    <th style={thStyle}>Vai trò</th>
                    <th style={thStyle}>Trạng thái</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Không có người dùng nào.</td>
                    </tr>
                ) : (
                    users.map((user) => (
                        <tr key={user.id} style={trStyle}>
                            <td style={tdStyle}>#{user.id}</td>
                            <td style={tdStyle}>
                                <div style={{ fontWeight: 'bold', color: '#333' }}>{user.username}</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>ID hệ thống: {user.id}</div>
                            </td>
                            <td style={tdStyle}>
                                <div style={{ fontSize: '13px' }}>✉️ {user.email}</div>
                                <div style={{ fontSize: '13px', color: '#4e73df' }}>📞 {user.phone || 'Chưa cập nhật'}</div>
                            </td>
                            <td style={tdStyle}>
                                <span style={roleBadgeStyle}>{user.role}</span>
                            </td>
                            <td style={tdStyle}>
                                <span style={statusBadgeStyle(user.status)}>
                                    {user.status === 'Active' ? '● Đang hoạt động' : '● Đã khóa'}
                                </span>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                <button
                                    onClick={() => handleToggleBlock(user.id, user.status)}
                                    style={btnActionStyle(user.status === 'Active')}
                                >
                                    {user.status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'}
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {/* Phân trang đồng bộ */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
}

// --- HỆ THỐNG STYLES ĐỒNG BỘ ---
const containerStyle = {
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
};

const tabGroupStyle = { display: 'flex', gap: '10px' };

const tabStyle = (active) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: active ? '#4e73df' : '#f1f5f9',
    color: active ? '#fff' : '#4e73df',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s'
});

const tableStyle = { width: '100%', borderCollapse: 'collapse' };

const thStyle = {
    textAlign: 'left',
    padding: '15px',
    color: '#4e73df',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const tdStyle = {
    padding: '15px',
    borderBottom: '1px solid #f1f5f9',
    color: '#5a5c69',
    fontSize: '14px',
    verticalAlign: 'middle'
};

const trStyle = { transition: 'background-color 0.2s' };

const roleBadgeStyle = {
    padding: '4px 8px',
    backgroundColor: '#f8f9fc',
    border: '1px solid #d1d3e2',
    borderRadius: '5px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#4e73df'
};

const statusBadgeStyle = (status) => ({
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: status === 'Active' ? '#def7ec' : '#fde2e1',
    color: status === 'Active' ? '#03543f' : '#9b1c1c',
    display: 'inline-block'
});

const btnActionStyle = (isActive) => ({
    backgroundColor: isActive ? '#e74c3c' : '#1cc88a',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
    minWidth: '120px',
    transition: 'opacity 0.2s'
});