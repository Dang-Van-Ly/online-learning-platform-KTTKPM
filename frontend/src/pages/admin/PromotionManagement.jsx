import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function PromotionManagement() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho form thêm mới
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [endDate, setEndDate] = useState('');

    const loadPromotions = async () => {
        try {
            const response = await api.get('/admin/promotions');
            if (Array.isArray(response.data)) {
                setPromotions(response.data);
            } else if (response.data && Array.isArray(response.data.result)) {
                setPromotions(response.data.result);
            } else {
                setPromotions([]);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách khuyến mãi:", error);
            setPromotions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPromotions();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!code || !discount || !endDate) return alert("Vui lòng điền đầy đủ thông tin!");

        try {
            // ✅ ĐÃ SỬA CỤC PAYLOAD ĐỒNG BỘ 100% VỚI BACKEND ENTITY
            const newPromo = {
                code: code.toUpperCase(),
                discountType: "PERCENTAGE",      // ✅ Thêm loại giảm giá bắt buộc
                discountValue: parseFloat(discount), // ✅ Đổi từ discountRate thành discountValue
                endDate: `${endDate}T23:59:59`,
                status: "ACTIVE"
            };

            await api.post('/admin/promotions', newPromo);
            alert("Thêm mã khuyến mãi thành công!");
            setCode(''); setDiscount(''); setEndDate('');
            loadPromotions();
        } catch (error) {
            console.error("Lỗi chi tiết từ Backend trả về nè Nga:", error.response?.data || error);

            const statusCode = error.response?.status || "Không rõ";
            const errorMessage = error.response?.data?.message || error.message;

            alert(`Tạo thất bại! Mã lỗi: ${statusCode}\nChi tiết: ${errorMessage}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa mã khuyến mãi này không?")) {
            try {
                await api.delete(`/admin/promotions/${id}`);
                alert("Xóa thành công!");
                loadPromotions();
            } catch (error) {
                alert("Không thể xóa mã khuyến mãi!");
            }
        }
    };

    const formatDate = (dateInput) => {
        if (!dateInput) return 'Vô hạn';
        if (Array.isArray(dateInput)) {
            return `${dateInput[2]}/${dateInput[1]}/${dateInput[0]}`;
        }
        return new Date(dateInput).toLocaleDateString('vi-VN');
    };

    if (loading) return <div style={{ padding: '20px' }}>Đang tải danh sách khuyến mãi...</div>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '25px', color: '#333', fontWeight: 'bold' }}>🎁 Quản Lý Mã Khuyến Mãi</h2>

            {/* FORM THÊM MỚI MÃ CẤP TỐC */}
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'flex-end', backgroundColor: '#f8f9fc', padding: '15px', borderRadius: '10px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Mã Code</label>
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ví dụ: GIAM20" style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>% Giảm giá</label>
                    <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Ví dụ: 20" max="100" style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>Ngày hết hạn</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
                </div>
                <button type="submit" style={btnSubmit}>Tạo Mã</button>
            </form>

            {/* BẢNG HIỂN THỊ */}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fc', borderBottom: '2px solid #eaecf1' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Mã Khuyến Mãi</th>
                    <th style={thStyle}>Mức Giảm</th>
                    <th style={thStyle}>Ngày Hết Hạn</th>
                    <th style={thStyle}>Trạng Thái</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Hành Động</th>
                </tr>
                </thead>
                <tbody>
                {promotions.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#858796' }}>Chưa có mã khuyến mãi nào tồn tại!</td>
                    </tr>
                ) : (
                    promotions.map((promo) => (
                        <tr key={promo.id} style={{ borderBottom: '1px solid #eaecf1' }}>
                            <td style={tdStyle}>#{promo.id}</td>
                            <td style={tdStyle}><span style={{ backgroundColor: '#eef2ff', color: '#4e73df', padding: '4px 8px', borderRadius: '5px', fontWeight: 'bold' }}>{promo.code}</span></td>
                            {/* ✅ Sửa chỗ này để hiển thị đúng discountValue từ Backend trả về */}
                            <td style={{ ...tdStyle, fontWeight: 'bold', color: '#2ecc71' }}>{promo.discountValue || promo.discountRate || 0}%</td>
                            <td style={tdStyle}>{formatDate(promo.endDate)}</td>
                            <td style={tdStyle}>
                                <span style={promo.status === 'ACTIVE' ? statusActive : statusExpired}>
                                    {promo.status === 'ACTIVE' ? '● Đang chạy' : '● Hết hạn'}
                                </span>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                <button onClick={() => handleDelete(promo.id)} style={btnDelete}>Xóa mã</button>
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
const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box' };
const btnSubmit = { padding: '8px 20px', backgroundColor: '#4e73df', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', height: '38px' };
const btnDelete = { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };
const statusActive = { color: '#1cc88a', fontWeight: 'bold', fontSize: '13px' };
const statusExpired = { color: '#e74c3c', fontWeight: 'bold', fontSize: '13px' };