import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const response = await api.get('/admin/orders');
            console.log("Dữ liệu từ API:", response.data);

            // Bộ lọc phòng thủ: Đảm bảo dữ liệu nhận vào luôn là mảng hợp lệ
            if (Array.isArray(response.data)) {
                setOrders(response.data);
            } else if (response.data && Array.isArray(response.data.result)) {
                setOrders(response.data.result);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        const text = newStatus === 'PAID' ? 'xác nhận ĐÃ THANH TOÁN' : 'HỦY';
        if (window.confirm(`Bạn có chắc chắn muốn ${text} đơn hàng này không?`)) {
            try {
                await api.put(`/admin/orders/${id}/status?status=${newStatus}`);
                alert("Cập nhật trạng thái đơn hàng thành công!");
                loadOrders();
            } catch (error) {
                alert("Không thể cập nhật đơn hàng!");
            }
        }
    };

    // Hàm xử lý hiển thị ngày tháng thông minh từ Backend gửi về
    const formatDate = (dateInput) => {
        if (!dateInput) return 'N/A';
        // Nếu Backend trả về dạng mảng số của LocalDateTime [YYYY, MM, DD, hh, mm, ss]
        if (Array.isArray(dateInput)) {
            const [year, month, day] = dateInput;
            const d = String(day).padStart(2, '0');
            const m = String(month).padStart(2, '0');
            return `${d}/${m}/${year}`;
        }
        // Nếu trả về dạng chuỗi ISO thông thường
        return new Date(dateInput).toLocaleDateString('vi-VN');
    };

    const getStatusStyle = (status) => {
        if (status === 'PAID') return { backgroundColor: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
        if (status === 'CANCELLED') return { backgroundColor: '#f8d7da', color: '#721c24', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
        return { backgroundColor: '#fff3cd', color: '#856404', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
    };

    if (loading) return <div style={{ padding: '20px' }}>Đang tải danh sách đơn hàng...</div>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '25px', color: '#333', fontWeight: 'bold' }}>🛒 Quản Lý Đơn Hàng Hệ Thống</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fc', borderBottom: '2px solid #eaecf1' }}>
                    <th style={thStyle}>Mã Đơn</th>
                    <th style={thStyle}>Tài khoản mua</th>
                    <th style={thStyle}>Danh sách khóa học</th>
                    <th style={thStyle}>PT Thanh toán</th>
                    <th style={thStyle}>Tổng Tiền</th>
                    <th style={thStyle}>Ngày Đặt</th>
                    <th style={thStyle}>Trạng Thái</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Hành Động</th>
                </tr>
                </thead>
                <tbody>
                {(!Array.isArray(orders) || orders.length === 0) ? (
                    <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#858796' }}>Chưa có đơn hàng nào!</td>
                    </tr>
                ) : (
                    orders.map((order) => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #eaecf1' }}>
                            <td style={tdStyle}><b>#{order.id}</b></td>
                            <td style={tdStyle}>{order.user?.username || 'N/A'}</td>

                            <td style={tdStyle}>
                                {order.orderItems && order.orderItems.length > 0 ? (
                                    <ul style={{ paddingLeft: '15px', margin: 0 }}>
                                        {order.orderItems.map((item, idx) => (
                                            <li key={idx}>{item.course?.name || 'Khóa học ẩn'}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span style={{ color: '#999', fontStyle: 'italic' }}>Trống</span>
                                )}
                            </td>

                            <td style={tdStyle}>{order.paymentMethod || 'BANK_TRANSFER'}</td>
                            <td style={{ ...tdStyle, fontWeight: 'bold', color: '#e74c3c' }}>
                                {order.totalPrice ? order.totalPrice.toLocaleString() : 0} đ
                            </td>
                            <td style={tdStyle}>{formatDate(order.createdAt)}</td>
                            <td style={tdStyle}>
                                    <span style={getStatusStyle(order.status)}>
                                        {order.status === 'PENDING' ? '⏳ Chờ duyệt' : order.status === 'PAID' ? '✅ Đã thanh toán' : '❌ Đã hủy'}
                                    </span>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                {order.status === 'PENDING' ? (
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        <button onClick={() => handleUpdateStatus(order.id, 'PAID')} style={btnSuccess}>Duyệt tiền</button>
                                        <button onClick={() => handleUpdateStatus(order.id, 'CANCELLED')} style={btnCancel}>Hủy đơn</button>
                                    </div>
                                ) : (
                                    <span style={{ color: '#b7b9cc', fontSize: '13px' }}>Đã xử lý</span>
                                )}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = { padding: '15px', color: '#4e73df', fontWeight: 'bold', fontSize: '14px' };
const tdStyle = { padding: '15px', fontSize: '14px', color: '#5a5c69', verticalAlign: 'middle' };
const btnSuccess = { padding: '6px 12px', backgroundColor: '#1cc88a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };
const btnCancel = { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };