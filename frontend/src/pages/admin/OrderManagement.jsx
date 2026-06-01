import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // State cho Modal chi tiết
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const loadOrders = async (page = 0) => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/orders?page=${page}&size=10`);
            setOrders(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setCurrentPage(response.data.number || 0);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders(0);
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        const text = newStatus === 'PAID' ? 'DUYỆT THANH TOÁN' : 'HỦY';
        if (window.confirm(`Xác nhận ${text} đơn hàng #${id}?`)) {
            try {
                await api.put(`/admin/orders/${id}/status?status=${newStatus}`);
                alert("Cập nhật thành công!");
                loadOrders(currentPage);
                if (showModal) setShowModal(false);
            } catch (error) {
                alert("Lỗi cập nhật trạng thái!");
            }
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const formatDate = (dateInput) => {
        if (!dateInput) return 'N/A';

        // TRƯỜNG HỢP 1: Nếu Backend trả về dạng Mảng [YYYY, MM, DD, HH, mm, ss]
        if (Array.isArray(dateInput)) {
            // Mảng thường có cấu trúc: [Năm, Tháng, Ngày, Giờ, Phút, Giây]
            const [year, month, day, hour, minute] = dateInput;

            // Lưu ý: Trong JS, tháng bắt đầu từ 0 nên phải lấy month - 1
            const date = new Date(year, month - 1, day, hour || 0, minute || 0);

            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // TRƯỜNG HỢP 2: Nếu Backend trả về dạng Chuỗi ISO hoặc Timestamp
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
            return date.toLocaleString('vi-VN');
        }

        return 'N/A';
    };

    if (loading && orders.length === 0) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải...</div>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'relative' }}>
            <h2 style={{ marginBottom: '25px', color: '#333', fontWeight: 'bold' }}>🛒 Quản Lý Đơn Hàng</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fc', borderBottom: '2px solid #eaecf1' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Khách hàng</th>
                    <th style={thStyle}>Tổng tiền</th>
                    <th style={thStyle}>Ngày đặt</th>
                    <th style={thStyle}>Trạng thái</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #eaecf1' }}>
                        <td style={tdStyle}><b>#{order.id}</b></td>
                        <td style={tdStyle}>{order.user?.username}</td>
                        <td style={{ ...tdStyle, color: '#e74c3c', fontWeight: 'bold' }}>{order.totalPrice?.toLocaleString()}đ</td>
                        <td style={tdStyle}>{formatDate(order.createdAt)}</td>
                        <td style={tdStyle}>
                            <span style={statusBadge(order.status)}>{order.status}</span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                <button onClick={() => handleViewDetails(order)} style={btnInfo}>Chi tiết</button>
                                {order.status === 'PENDING' && (
                                    <button onClick={() => handleUpdateStatus(order.id, 'PAID')} style={btnSuccess}>Duyệt</button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => loadOrders(page)} />

            {/* ================= MODAL CHI TIẾT ĐƠN HÀNG ================= */}
            {showModal && selectedOrder && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={modalHeader}>
                            <h3 style={{ margin: 0 }}>Chi Tiết Đơn Hàng #{selectedOrder.id}</h3>
                            <button onClick={() => setShowModal(false)} style={btnClose}>&times;</button>
                        </div>

                        <div style={modalBody}>
                            <div style={infoGrid}>
                                <div>
                                    <p><b>Người mua:</b> {selectedOrder.user?.username}</p>
                                    <p><b>Email:</b> {selectedOrder.user?.email}</p>
                                </div>
                                <div>
                                    <p><b>Ngày đặt:</b> {formatDate(selectedOrder.createdAt)}</p>
                                    <p><b>PT Thanh toán:</b> {selectedOrder.paymentMethod || 'Chuyển khoản'}</p>
                                </div>
                            </div>

                            <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Danh sách sản phẩm</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                <thead>
                                <tr style={{ textAlign: 'left', fontSize: '13px', color: '#888' }}>
                                    <th style={{ padding: '10px' }}>Tên sản phẩm</th>
                                    <th style={{ padding: '10px', textAlign: 'right' }}>Giá tiền</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedOrder.orderItems?.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #fafafa' }}>
                                        <td style={{ padding: '10px' }}>
                                            {item.course?.name || item.membership?.name || "Sản phẩm không xác định"}
                                            <br/>
                                            <small style={{ color: '#aaa' }}>{item.course ? 'Khóa học' : 'Gói hội viên'}</small>
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                                            {item.price?.toLocaleString()}đ
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>TỔNG CỘNG</td>
                                    <td style={{ padding: '15px 10px', textAlign: 'right', color: '#e74c3c', fontSize: '18px', fontWeight: 'black' }}>
                                        {selectedOrder.totalPrice?.toLocaleString()}đ
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div style={modalFooter}>
                            {selectedOrder.status === 'PENDING' && (
                                <button onClick={() => handleUpdateStatus(selectedOrder.id, 'PAID')} style={btnSuccessLarge}>Xác nhận đã nhận tiền</button>
                            )}
                            <button onClick={() => setShowModal(false)} style={btnSecondary}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- STYLES ---
const thStyle = { padding: '15px', color: '#4e73df', fontSize: '13px', textTransform: 'uppercase' };
const tdStyle = { padding: '15px', fontSize: '14px', color: '#333' };
const btnInfo = { backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const btnSuccess = { backgroundColor: '#1cc88a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const btnSuccessLarge = { backgroundColor: '#1cc88a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flex: 1 };
const btnSecondary = { backgroundColor: '#858796', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const btnClose = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#aaa' };

const statusBadge = (status) => ({
    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
    backgroundColor: status === 'PAID' ? '#def7ec' : status === 'PENDING' ? '#fef3c7' : '#fde2e1',
    color: status === 'PAID' ? '#03543f' : status === 'PENDING' ? '#92400e' : '#9b1c1c'
});

// Modal Styles
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: '#fff', width: '90%', maxWidth: '600px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' };
const modalHeader = { padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fc' };
const modalBody = { padding: '20px', maxHeight: '400px', overflowY: 'auto', textAlign: 'left' };
const modalFooter = { padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' };
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', fontSize: '14px', color: '#555' };