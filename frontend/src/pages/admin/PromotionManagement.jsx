import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function PromotionManagement() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho form nhập liệu
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('PERCENTAGE');
    const [discountValue, setDiscountValue] = useState('');
    const [minOrderValue, setMinOrderValue] = useState('');
    const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // 🔑 State phục vụ tính năng CHỈNH SỬA MÃ
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

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

    // 🛠️ Hàm xử lý bấm nút "Sửa" trên từng dòng bảng danh sách
    // 🛠️ Hàm xử lý bấm nút "Sửa" - Đã nâng cấp bộ chuyển đổi ngày tháng chuẩn YYYY-MM-DD
    const handleEditClick = (promo) => {
        setIsEditing(true);
        setEditingId(promo.id);
        setCode(promo.code);
        setDiscountType(promo.discountType);
        setDiscountValue(promo.discountValue);
        setMinOrderValue(promo.minOrderValue || '');
        setMaxDiscountAmount(promo.maxDiscountAmount || '');

        // 🔑 Hàm nội bộ giúp ép mọi kiểu dữ liệu ngày về dạng YYYY-MM-DD chuẩn chỉ
        const parseToInputDate = (dateInput) => {
            if (!dateInput) return '';

            // Trường hợp 1: Backend trả về dạng Mảng [YYYY, M, D]
            if (Array.isArray(dateInput)) {
                const year = dateInput[0];
                const month = String(dateInput[1]).padStart(2, '0'); // Ép 2 số (vđ: 05)
                const day = String(dateInput[2]).padStart(2, '0');   // Ép 2 số (vđ: 20)
                return `${year}-${month}-${day}`;
            }

            // Trường hợp 2: Backend trả về dạng Chuỗi (vđ: "2026-05-20T23:59:59" hoặc timestamp)
            try {
                const dateObj = new Date(dateInput);
                if (!isNaN(dateObj.getTime())) {
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            } catch (e) {
                console.error("Lỗi parse ngày:", e);
            }

            // Cắt chuỗi dự phòng nếu có chuỗi dạng "2026-05-20..."
            return String(dateInput).split('T')[0];
        };

        // Ép định dạng và đổ thẳng dữ liệu vào ô input date nè Nga na!
        setStartDate(parseToInputDate(promo.startDate));
        setEndDate(parseToInputDate(promo.endDate));
    };

    // 🛠️ Hàm hủy bỏ chế độ sửa, làm sạch Form về ban đầu
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        setCode(''); setDiscountValue(''); setMinOrderValue(''); setMaxDiscountAmount(''); setStartDate(''); setEndDate('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code || !discountValue || !startDate || !endDate || !minOrderValue) {
            return alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        }

        const payload = {
            code: code.toUpperCase(),
            discountType: discountType,
            discountValue: parseFloat(discountValue),
            minOrderValue: parseFloat(minOrderValue),
            maxDiscountAmount: discountType === 'PERCENTAGE' && maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
            startDate: startDate.includes('T') ? startDate : `${startDate}T00:00:00`,
            endDate: endDate.includes('T') ? endDate : `${endDate}T23:59:59`,
        };

        try {
            if (isEditing) {
                // 🔑 Trường hợp ĐANG SỬA: Gọi lệnh PUT
                await api.put(`/admin/promotions/${editingId}`, payload);
                alert("Cập nhật mã khuyến mãi thành công!");
            } else {
                // Trường hợp TẠO MỚI: Gọi lệnh POST
                payload.status = "ACTIVE";
                await api.post('/admin/promotions', payload);
                alert("Thêm mã khuyến mãi thành công!");
            }
            handleCancelEdit(); // Làm sạch form
            loadPromotions();   // Tải lại danh sách
        } catch (error) {
            alert(`Thao tác thất bại! ${error.response?.data?.message || error.message}`);
        }
    };

    const handleToggleStatus = async (promo) => {
        const nextStatus = promo.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        const confirmMsg = promo.status === 'ACTIVE'
            ? `Bạn có chắc chắn muốn TẠM DỪNG mã ${promo.code} không?`
            : `Bạn có muốn KÍCH HOẠT LẠI mã ${promo.code} không?`;

        if (window.confirm(confirmMsg)) {
            try {
                await api.put(`/admin/promotions/${promo.id}/status`, { status: nextStatus });
                setPromotions(prevPromotions =>
                    prevPromotions.map(item =>
                        item.id === promo.id ? { ...item, status: nextStatus } : item
                    )
                );
                alert("Cập nhật trạng thái thành công!");
            } catch (error) {
                alert("Không thể cập nhật trạng thái!");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hẳn mã này không?")) {
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
        if (!dateInput) return 'Không rõ';
        if (Array.isArray(dateInput)) {
            return `${dateInput[2]}/${dateInput[1]}/${dateInput[0]}`;
        }
        return new Date(dateInput).toLocaleDateString('vi-VN');
    };

    if (loading) return <div style={{ padding: '20px' }}>Đang tải danh sách khuyến mãi...</div>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '25px', color: '#333', fontWeight: 'bold' }}>🎁 Quản Lý Mã Khuyến Mãi Hệ Thống</h2>

            {/* FORM NHẬP LIỆU ĐA NĂNG (TẠO MỚI / CẬP NHẬT) */}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px', backgroundColor: isEditing ? '#fff3cd' : '#f8f9fc', padding: '20px', borderRadius: '10px', alignItems: 'flex-end', border: isEditing ? '1px solid #ffeeba' : 'none' }}>
                <div>
                    <label style={labelStyle}>Mã Code</label>
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="GIAM20" style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Loại giảm giá</label>
                    <select value={discountType} onChange={(e) => { setDiscountType(e.target.value); setDiscountValue(''); setMaxDiscountAmount(''); }} style={inputStyle}>
                        <option value="PERCENTAGE">Giảm theo %</option>
                        <option value="FIXED">Giảm theo Số tiền ($)</option>
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>{discountType === 'PERCENTAGE' ? 'Mức giảm (%)' : 'Số tiền giảm (VND)'}</label>
                    <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === 'PERCENTAGE' ? "20" : "50000"} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Đơn tối thiểu (VND)</label>
                    <input type="number" value={minOrderValue} onChange={(e) => setMinOrderValue(e.target.value)} placeholder="100000" style={inputStyle} />
                </div>

                {discountType === 'PERCENTAGE' ? (
                    <div>
                        <label style={labelStyle}>Giảm tối đa (VND)</label>
                        <input type="number" value={maxDiscountAmount} onChange={(e) => setMaxDiscountAmount(e.target.value)} placeholder="30000" style={inputStyle} />
                    </div>
                ) : <div />}

                <div>
                    <label style={labelStyle}>Ngày bắt đầu</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Ngày hết hạn</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '10px', minWidth: '160px' }}>
                    <button type="submit" style={{ ...btnSubmit, backgroundColor: isEditing ? '#ffc107' : '#4e73df', color: isEditing ? '#000' : '#fff' }}>
                        {isEditing ? 'Cập Nhật' : 'Tạo Mã'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={handleCancelEdit} style={{ ...btnSubmit, backgroundColor: '#6c757d', color: '#fff' }}>
                            Hủy
                        </button>
                    )}
                </div>
            </form>

            {/* BẢNG HIỂN THỊ */}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fc', borderBottom: '2px solid #eaecf1' }}>
                    <th style={thStyle}>Mã Code</th>
                    <th style={thStyle}>Mức Giảm</th>
                    <th style={thStyle}>Điều Kiện Áp Dụng</th>
                    <th style={thStyle}>Thời Gian</th>
                    <th style={thStyle}>Trạng Thắng</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Hành Động</th>
                </tr>
                </thead>
                <tbody>
                {promotions.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#858796' }}>Chưa có mã khuyến mãi nào!</td>
                    </tr>
                ) : (
                    promotions.map((promo) => (
                        <tr key={promo.id} style={{ borderBottom: '1px solid #eaecf1' }}>
                            <td style={tdStyle}><span style={{ backgroundColor: '#eef2ff', color: '#4e73df', padding: '4px 8px', borderRadius: '5px', fontWeight: 'bold' }}>{promo.code}</span></td>
                            <td style={{ ...tdStyle, fontWeight: 'bold', color: '#2ecc71' }}>
                                {promo.discountType === 'PERCENTAGE'
                                    ? `${promo.discountValue}%`
                                    : `${Number(promo.discountValue).toLocaleString('vi-VN')} VND`
                                }
                            </td>
                            <td style={tdStyle}>
                                <div style={{ fontSize: '12px', color: '#4e73df' }}>• Đơn từ: {Number(promo.minOrderValue || 0).toLocaleString('vi-VN')}đ</div>
                                {promo.discountType === 'PERCENTAGE' && promo.maxDiscountAmount && (
                                    <div style={{ fontSize: '12px', color: '#e74c3c' }}>• Giảm tối đa: {Number(promo.maxDiscountAmount).toLocaleString('vi-VN')}đ</div>
                                )}
                            </td>
                            <td style={{ ...tdStyle, fontSize: '12px' }}>{formatDate(promo.startDate)} - {formatDate(promo.endDate)}</td>
                            <td style={tdStyle}>
                                <span style={promo.status === 'ACTIVE' ? statusActive : promo.status === 'PAUSED' ? statusPaused : statusExpired}>
                                    {promo.status === 'ACTIVE' ? '● Đang chạy' : promo.status === 'PAUSED' ? '● Tạm dừng' : '● Hết hạn'}
                                </span>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'center', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                {/* NÚT SỬA MỚI TOANH NÈ NGA */}
                                <button onClick={() => handleEditClick(promo)} style={{ ...btnAction, backgroundColor: '#3498db' }}>Sửa</button>
                                <button onClick={() => handleToggleStatus(promo)} style={{ ...btnAction, backgroundColor: promo.status === 'ACTIVE' ? '#f1c40f' : '#2ecc71', color: '#fff' }}>
                                    {promo.status === 'ACTIVE' ? 'Dừng' : 'Mở'}
                                </button>
                                <button onClick={() => handleDelete(promo.id)} style={{ ...btnAction, backgroundColor: '#e74c3c' }}>Xóa</button>
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
const tdStyle = { padding: '15px', fontSize: '13px', color: '#5a5c69', verticalAlign: 'middle' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '12px', color: '#333' };
const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d1d3e2', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box', height: '38px' };

const btnSubmit = {
    padding: '0 15px',
    backgroundColor: '#4e73df',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    height: '38px',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const btnAction = { padding: '6px 8px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' };
const statusActive = { color: '#1cc88a', fontWeight: 'bold', fontSize: '12px' };
const statusPaused = { color: '#f1c40f', fontWeight: 'bold', fontSize: '12px' };
const statusExpired = { color: '#e74c3c', fontWeight: 'bold', fontSize: '12px' };