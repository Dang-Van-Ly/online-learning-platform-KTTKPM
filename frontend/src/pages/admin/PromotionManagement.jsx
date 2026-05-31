import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination'; // 👈 Import component dùng chung

export default function PromotionManagement() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    // State cho form
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('PERCENTAGE');
    const [discountValue, setDiscountValue] = useState('');
    const [minOrderValue, setMinOrderValue] = useState('');
    const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // 1. Tải danh sách có phân trang
    const loadPromotions = async (page = 0) => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/promotions?page=${page}&size=${pageSize}`);

            // Xử lý dữ liệu từ Page object của Spring Boot
            if (response.data && response.data.content) {
                setPromotions(response.data.content);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.number);
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
        loadPromotions(0);
    }, []);

    // 2. Logic xử lý Form (Submit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            code: code.toUpperCase(),
            discountType,
            discountValue: parseFloat(discountValue),
            minOrderValue: parseFloat(minOrderValue),
            maxDiscountAmount: discountType === 'PERCENTAGE' ? parseFloat(maxDiscountAmount) : null,
            startDate: startDate.includes('T') ? startDate : `${startDate}T00:00:00`,
            endDate: endDate.includes('T') ? endDate : `${endDate}T23:59:59`,
        };

        try {
            if (isEditing) {
                await api.put(`/admin/promotions/${editingId}`, payload);
                alert("Cập nhật thành công!");
            } else {
                payload.status = "ACTIVE";
                await api.post('/admin/promotions', payload);
                alert("Thêm mới thành công!");
            }
            handleCancelEdit();
            loadPromotions(currentPage); // Tải lại trang hiện tại
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || "Vui lòng kiểm tra lại dữ liệu"));
        }
    };

    // 3. Các hàm bổ trợ
    const handleEditClick = (promo) => {
        setIsEditing(true);
        setEditingId(promo.id);
        setCode(promo.code);
        setDiscountType(promo.discountType);
        setDiscountValue(promo.discountValue);
        setMinOrderValue(promo.minOrderValue || '');
        setMaxDiscountAmount(promo.maxDiscountAmount || '');
        setStartDate(parseDateToInput(promo.startDate));
        setEndDate(parseDateToInput(promo.endDate));
    };

    const parseDateToInput = (dateArr) => {
        if (!dateArr || !Array.isArray(dateArr)) return '';
        const [y, m, d] = dateArr;
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    };

    const handleCancelEdit = () => {
        setIsEditing(false); setEditingId(null); setCode(''); setDiscountValue('');
        setMinOrderValue(''); setMaxDiscountAmount(''); setStartDate(''); setEndDate('');
    };

    const handleToggleStatus = async (promo) => {
        const nextStatus = promo.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        if (window.confirm(`Xác nhận đổi trạng thái mã ${promo.code}?`)) {
            await api.put(`/admin/promotions/${promo.id}/status`, { status: nextStatus });
            loadPromotions(currentPage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa vĩnh viễn mã này?")) {
            await api.delete(`/admin/promotions/${id}`);
            loadPromotions(currentPage);
        }
    };

    if (loading && promotions.length === 0) return <div style={{textAlign:'center', padding:'50px'}}>Đang tải...</div>;

    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: '25px', color: '#333', fontWeight: 'bold' }}>🎁 Quản Lý Khuyến Mãi</h2>

            {/* FORM NHẬP LIỆU */}
            <form onSubmit={handleSubmit} style={formStyle(isEditing)}>
                <div style={gridForm}>
                    <div>
                        <label style={labelStyle}>Mã Code</label>
                        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="GIAM20" style={inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Loại</label>
                        <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} style={inputStyle}>
                            <option value="PERCENTAGE">Phần trăm (%)</option>
                            <option value="FIXED">Số tiền cố định (đ)</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Mức giảm</label>
                        <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} style={inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Đơn tối thiểu</label>
                        <input type="number" value={minOrderValue} onChange={(e) => setMinOrderValue(e.target.value)} style={inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Ngày bắt đầu</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Ngày hết hạn</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} required />
                    </div>
                </div>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button type="submit" style={isEditing ? btnUpdate : btnCreate}>
                        {isEditing ? 'Cập nhật mã' : 'Tạo mã mới'}
                    </button>
                    {isEditing && <button type="button" onClick={handleCancelEdit} style={btnCancel}>Hủy</button>}
                </div>
            </form>

            {/* BẢNG DANH SÁCH */}
            <table style={tableStyle}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fc', borderBottom: '2px solid #eaecf1' }}>
                    <th style={thStyle}>Mã Code</th>
                    <th style={thStyle}>Mức Giảm</th>
                    <th style={thStyle}>Điều kiện</th>
                    <th style={thStyle}>Trạng thái</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {promotions.map((promo) => (
                    <tr key={promo.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={tdStyle}><span style={codeBadge}>{promo.code}</span></td>
                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#2ecc71' }}>
                            {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `${promo.discountValue?.toLocaleString()}đ`}
                        </td>
                        <td style={tdStyle}>Đơn từ {promo.minOrderValue?.toLocaleString()}đ</td>
                        <td style={tdStyle}>
                                <span style={statusText(promo.status)}>
                                    {promo.status === 'ACTIVE' ? '● Đang chạy' : '● Tạm dừng'}
                                </span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                <button onClick={() => handleEditClick(promo)} style={btnSmallInfo}>Sửa</button>
                                <button onClick={() => handleToggleStatus(promo)} style={promo.status === 'ACTIVE' ? btnSmallWarn : btnSmallGreen}>
                                    {promo.status === 'ACTIVE' ? 'Dừng' : 'Mở'}
                                </button>
                                <button onClick={() => handleDelete(promo.id)} style={btnSmallRed}>Xóa</button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* PHÂN TRANG ĐỒNG BỘ */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => loadPromotions(page)}
            />
        </div>
    );
}

// --- STYLES ĐỒNG BỘ ADMIN ---
const containerStyle = { padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const formStyle = (isEdit) => ({ marginBottom: '30px', padding: '20px', backgroundColor: isEdit ? '#fff3cd' : '#f8f9fc', borderRadius: '10px', border: isEdit ? '1px solid #ffeeba' : 'none' });
const gridForm = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #d1d3e2', borderRadius: '6px', fontSize: '13px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px', color: '#555' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const thStyle = { padding: '15px', color: '#4e73df', fontSize: '13px', textTransform: 'uppercase' };
const tdStyle = { padding: '15px', fontSize: '14px' };

const btnCreate = { padding: '10px 20px', backgroundColor: '#4e73df', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const btnUpdate = { padding: '10px 20px', backgroundColor: '#f1c40f', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const btnCancel = { padding: '10px 20px', backgroundColor: '#858796', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

const btnSmallRed = { padding: '5px 10px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' };
const btnSmallInfo = { padding: '5px 10px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' };
const btnSmallGreen = { padding: '5px 10px', backgroundColor: '#1cc88a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' };
const btnSmallWarn = { padding: '5px 10px', backgroundColor: '#f39c12', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' };

const codeBadge = { backgroundColor: '#eef2ff', color: '#4e73df', padding: '4px 8px', borderRadius: '5px', fontWeight: 'bold', fontSize: '12px' };
const statusText = (status) => ({ fontWeight: 'bold', fontSize: '12px', color: status === 'ACTIVE' ? '#1cc88a' : '#f1c40f' });