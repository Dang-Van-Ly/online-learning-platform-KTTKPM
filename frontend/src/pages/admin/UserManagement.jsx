import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState('STUDENT');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const loadUsers = async (role, pageNum = 0) => {
        setLoading(true);
        setUsers([]);
        try {
            const endpoint = role === 'STUDENT' ? '/admin/users/students' : '/admin/users/instructors';
            const response = await api.get(`${endpoint}?page=${pageNum}&size=10`);

            if (response.data && response.data.content) {
                setUsers(response.data.content);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.number);
            }
        } catch (error) {
            console.error(error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(activeTab, currentPage);
    }, [activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(0);
        loadUsers(tab, 0);
    };

    const handleToggleBlock = async (userId, currentStatus) => {
        if (window.confirm("Xác nhận thay đổi trạng thái?")) {
            await api.put(`/admin/users/${userId}/toggle-status`);
            loadUsers(activeTab, currentPage);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '15px' }}>
            <h2 style={{ marginBottom: '20px', fontWeight: 'bold' }}>👤 Quản Lý Người Dùng</h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                <button onClick={() => handleTabChange('STUDENT')} style={activeTab === 'STUDENT' ? tabActive : tabInactive}>Học Viên</button>
                <button onClick={() => handleTabChange('INSTRUCTOR')} style={activeTab === 'INSTRUCTOR' ? tabActive : tabInactive}>Giảng Viên</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fc', borderBottom: '2px solid #eaecf1' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Tên Đăng Nhập</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Trạng Thái</th>
                    <th style={thStyle}>Thao Tác</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eaecf1' }}>
                        <td style={tdStyle}>{user.id}</td>
                        <td style={tdStyle}><b>{user.username}</b></td>
                        <td style={tdStyle}>{user.email}</td>
                        <td style={tdStyle}>{user.status === 'Active' ? '🟢 Hoạt động' : '🔴 Khóa'}</td>
                        <td style={tdStyle}>
                            <button onClick={() => handleToggleBlock(user.id, user.status)} style={user.status === 'Active' ? btnRed : btnGreen}>
                                {user.status === 'Active' ? 'Khóa' : 'Mở khóa'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                    setCurrentPage(page);
                    loadUsers(activeTab, page);
                }}
            />
        </div>
    );
}

const thStyle = { padding: '15px', textAlign: 'left', color: '#4e73df' };
const tdStyle = { padding: '15px' };
const tabActive = { padding: '10px 20px', backgroundColor: '#4e73df', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const tabInactive = { padding: '10px 20px', backgroundColor: '#fff', color: '#4e73df', border: '1px solid #d1d3e2', borderRadius: '5px', cursor: 'pointer' };
const btnRed = { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const btnGreen = { backgroundColor: '#1cc88a', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };