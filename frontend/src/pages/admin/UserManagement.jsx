import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Lấy danh sách User từ MariaDB
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Lỗi kết nối hoặc phân quyền rồi na:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Hàm xử lý xóa User
    const handleDelete = async (id) => {
        if (window.confirm("Có chắc muốn xóa người này khỏi hệ thống không na?")) {
            try {
                const response = await api.delete(`/admin/users/${id}`);
                if (response.status === 200) {
                    alert("Đã xóa thành công!");
                    fetchUsers();
                }
            } catch (error) {
                console.error("Lỗi xóa user:", error);
            }
        }
    };

    // 3. Hàm thay đổi trạng thái (Toggle 1 <-> 0)
    const toggleStatus = async (id) => {
        try {
            const response = await api.put(`/admin/users/${id}/toggle-status`);
            if (response.status === 200) {
                fetchUsers(); // Load lại danh sách sau khi cập nhật
            }
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải danh sách từ MariaDB cho Nga na...</div>;

    return (
        <div style={containerStyle}>
            <div style={headerTableStyle}>
                <h2>Quản lý người dùng ({users.length})</h2>
                <button style={addBtnStyle}>+ Thêm Admin mới</button>
            </div>

            <table style={tableStyle}>
                <thead>
                <tr style={{ backgroundColor: '#f1f1f1' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Username</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Quyền</th>
                    <th style={thStyle}>Trạng thái</th>
                    <th style={thStyle}>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id} style={trStyle}>
                        <td style={tdStyle}>{user.id}</td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{user.username}</td>
                        <td style={tdStyle}>{user.email}</td>
                        <td style={tdStyle}>
                            <span style={roleBadge(user.role)}>{user.role}</span>
                        </td>
                        {/* SỬA LẠI: So sánh số 1 để hiển thị trạng thái */}
                        <td style={tdStyle}>
                            <span style={{ color: user.status == 1 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                                ● {user.status == 1 ? 'Active' : 'Locked'}
                            </span>
                        </td>
                        <td style={tdStyle}>
                            {/* SỬA LẠI: Nút bấm thay đổi theo trạng thái số */}
                            <button onClick={() => toggleStatus(user.id)} style={actionBtnStyle(user.status == 1 ? "#f39c12" : "#2ecc71")}>
                                {user.status == 1 ? 'Khóa' : 'Mở'}
                            </button>
                            <button onClick={() => handleDelete(user.id)} style={actionBtnStyle("#e74c3c")}>Xóa</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

// Giữ nguyên các Style của Nga na
const containerStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const headerTableStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '14px' };
const thStyle = { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', color: '#666' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };
const trStyle = { transition: '0.3s' };
const addBtnStyle = { backgroundColor: '#4e73df', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const actionBtnStyle = (color) => ({ backgroundColor: color, color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px' });
const roleBadge = (role) => ({
    padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
    backgroundColor: role === 'ADMIN' ? '#e74c3c' : role === 'INSTRUCTOR' ? '#f39c12' : '#3498db',
    color: 'white'
});