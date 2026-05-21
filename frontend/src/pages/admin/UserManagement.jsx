import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState('STUDENT');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    const [showForm, setShowForm] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [createRole, setCreateRole] = useState('STUDENT');

    const loadUsers = async (role, pageNum = 0) => {
        setLoading(true);
        try {
            const endpoint = role === 'STUDENT' ? '/admin/users/students' : '/admin/users/instructors';
            const response = await api.get(`${endpoint}?page=${pageNum}&size=${pageSize}`);

            if (response.data) {
                if (Array.isArray(response.data.content)) {
                    setUsers(response.data.content);
                    setTotalPages(response.data.totalPages);
                    setCurrentPage(response.data.number);
                } else if (Array.isArray(response.data)) {
                    setUsers(response.data);
                    setTotalPages(1);
                    setCurrentPage(0);
                }
            }
        } catch (error) {
            console.error("Lỗi tải danh sách người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(activeTab, currentPage);
    }, [activeTab, currentPage]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(0);
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            return alert("Vui lòng nhập đầy đủ các trường thông tin bắt buộc!");
        }

        try {
            const payload = { username, email, phone, password };
            await api.post(`/admin/users/create?roleType=${createRole}`, payload);
            alert("Tạo tài khoản người dùng mới thành công.");
            setUsername(''); setEmail(''); setPhone(''); setPassword('');
            setShowForm(false);
            handleTabChange(createRole);
        } catch (error) {
            alert(`Lỗi hệ thống: ${error.response?.data?.message || "Tên tài khoản hoặc Email đã tồn tại trong hệ thống."}`);
        }
    };

    const handleToggleBlock = async (userId, currentStatus) => {
        const isCurrentlyActive = currentStatus === 'Active';
        const actionText = isCurrentlyActive ? "KHÓA" : "MỞ KHÓA";

        if (window.confirm(`Xác nhận thay đổi trạng thái thành [${actionText}] đối với tài khoản này?`)) {
            try {
                await api.put(`/admin/users/${userId}/toggle-status`);
                alert("Cập nhật trạng thái tài khoản thành công.");
                loadUsers(activeTab, currentPage);
            } catch (error) {
                console.error("Lỗi cập nhật trạng thái:", error);
                alert("Thao tác thất bại. Vui lòng kiểm tra lại kết nối hệ thống.");
            }
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#333', fontWeight: 'bold', margin: 0 }}>👤 Quản Lý Người Dùng Hệ Thống</h2>
                <button onClick={() => setShowForm(!showForm)} style={btnToggleFormStyle}>
                    {showForm ? '✖ Đóng Form Khởi Tạo' : '➕ Tạo Tài Khoản Mới'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreateAccount} style={formStyle}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#4e73df' }}>⚙ Nhập Thông Tin Tài Khoản</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', alignItems: 'flex-end' }}>
                        <div>
                            <label style={labelStyle}>Tên Đăng Nhập *</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nhập username..." style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Mật Khẩu *</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Địa Chỉ Email *</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Số Điện Thoại</label>
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Vai Trò Hệ Thống</label>
                            <select value={createRole} onChange={(e) => setCreateRole(e.target.value)} style={inputStyle}>
                                <option value="STUDENT">Học Viên (Student)</option>
                                <option value="INSTRUCTOR">Giáo Viên (Instructor)</option>
                            </select>
                        </div>
                        <button type="submit" style={btnSubmitStyle}>Xác Nhận Tạo</button>
                    </div>
                </form>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #eaecf1', paddingBottom: '10px' }}>
                <button onClick={() => handleTabChange('STUDENT')} style={activeTab === 'STUDENT' ? tabActiveStyle : tabInactiveStyle}>
                    👨‍🎓 Danh Sách Học Viên
                </button>
                <button onClick={() => handleTabChange('INSTRUCTOR')} style={activeTab === 'INSTRUCTOR' ? tabActiveStyle : tabInactiveStyle}>
                    👨‍🏫 Danh Sách Giáo Viên
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '20px', color: '#858796' }}>Đang tải dữ liệu từ máy chủ...</div>
            ) : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#f8f9fc', borderBottom: '2px solid #eaecf1' }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Tên Đăng Nhập</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Số Điện Thoại</th>
                            <th style={thStyle}>Trạng Thái</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Thao Tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#858796' }}>Không có dữ liệu người dùng hiển thị.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #eaecf1' }}>
                                    <td style={tdStyle}>{user.id}</td>
                                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{user.username}</td>
                                    <td style={tdStyle}>{user.email || 'Chưa cập nhật'}</td>
                                    <td style={tdStyle}>{user.phone || 'Chưa cập nhật'}</td>
                                    <td style={tdStyle}>
                                        <span style={user.status === 'Active' ? statusActive : statusBlocked}>
                                            {user.status === 'Active' ? '● Đang hoạt động' : '● Đã khóa'}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleToggleBlock(user.id, user.status)}
                                            style={{ ...btnAction, backgroundColor: user.status === 'Active' ? '#e74c3c' : '#2ecc71' }}
                                        >
                                            {user.status === 'Active' ? 'Khóa' : 'Mở khóa'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                style={currentPage === 0 ? btnPageDisabled : btnPageStyle}
                            >
                                ◀ Trước
                            </button>

                            <span style={{ fontSize: '14px', color: '#4e73df', fontWeight: 'bold' }}>
                                Trang {currentPage + 1} / {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1}
                                style={currentPage === totalPages - 1 ? btnPageDisabled : btnPageStyle}
                            >
                                Sau ▶
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

const thStyle = { padding: '15px', color: '#4e73df', fontWeight: 'bold', fontSize: '14px' };
const tdStyle = { padding: '15px', fontSize: '13px', color: '#5a5c69', verticalAlign: 'middle' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px', color: '#333' };
const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box', height: '38px' };
const btnAction = { padding: '6px 12px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', minWidth: '80px' };
const statusActive = { color: '#1cc88a', fontWeight: 'bold', fontSize: '12px' };
const statusBlocked = { color: '#e74c3c', fontWeight: 'bold', fontSize: '12px' };
const tabActiveStyle = { padding: '10px 20px', backgroundColor: '#4e73df', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
const tabInactiveStyle = { padding: '10px 20px', backgroundColor: '#f8f9fc', color: '#4e73df', border: '1px solid #d1d3e2', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
const btnToggleFormStyle = { padding: '8px 15px', backgroundColor: '#1cc88a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
const btnSubmitStyle = { padding: '0 15px', backgroundColor: '#4e73df', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', height: '38px', width: '100%', whiteSpace: 'nowrap' };
const formStyle = { marginBottom: '25px', backgroundColor: '#f8f9fc', padding: '20px', borderRadius: '10px', border: '1px solid #eaecf1' };
const btnPageStyle = { padding: '6px 15px', backgroundColor: '#4e73df', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };
const btnPageDisabled = { padding: '6px 15px', backgroundColor: '#eaecf1', color: '#b7b9cc', border: 'none', borderRadius: '5px', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '12px' };