import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const loadOrders = async (page = 0) => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/orders?page=${page}&size=10`);
            setOrders(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setCurrentPage(response.data.number || 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders(0);
    }, []);

    const handleUpdateStatus = async (id, status) => {
        await api.put(`/admin/orders/${id}/status?status=${status}`);
        loadOrders(currentPage);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '15px' }}>
            <h2 style={{ marginBottom: '25px', fontWeight: 'bold' }}>🛒 Quản Lý Đơn Hàng</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fc' }}>
                    <th style={tdStyle}>ID</th>
                    <th style={tdStyle}>User</th>
                    <th style={tdStyle}>Tổng Tiền</th>
                    <th style={tdStyle}>Trạng Thái</th>
                    <th style={tdStyle}>Thao Tác</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(o => (
                    <tr key={o.id}>
                        <td style={tdStyle}>#{o.id}</td>
                        <td style={tdStyle}>{o.user?.username}</td>
                        <td style={tdStyle}>{o.totalPrice?.toLocaleString()}đ</td>
                        <td style={tdStyle}>{o.status}</td>
                        <td style={tdStyle}>
                            {o.status === 'PENDING' && <button onClick={() => handleUpdateStatus(o.id, 'PAID')} style={btnGreen}>Duyệt</button>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => loadOrders(page)}
            />
        </div>
    );
}

const btnGreen = { backgroundColor: '#1cc88a', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #eee' };