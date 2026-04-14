import React from 'react';
// 1. Import useNavigate từ react-router-dom
import { useNavigate } from 'react-router-dom'; 
import { Search, ShoppingCart, UserCircle } from 'lucide-react';

const KHOKHOAHOCHeader = () => {
  // 2. Khởi tạo hook navigate
  const navigate = useNavigate();

  const s = {
    header: {
      width: '100%',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
    },
    topBar: {
      backgroundColor: '#b31c1c',
      color: '#fff',
      padding: '6px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      fontSize: '12px',
    },
    timerBox: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: '2px 8px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '13px',
      fontWeight: 'bold',
      margin: '0 5px',
    },
    dealBadge: {
      backgroundColor: '#ffd700',
      color: '#b31c1c',
      padding: '3px 12px',
      borderRadius: '20px',
      fontWeight: 'bold',
      border: 'none',
      fontSize: '11px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    mainHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 5%', 
      gap: '25px',
    },
    logoWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      cursor: 'pointer', // Thêm cursor để biết logo click được
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '900',
      color: '#003c71',
      lineHeight: '0.8',
    },
    searchBar: {
      flex: '0 1 450px',
      display: 'flex',
      height: '34px',
      border: '1px solid #3b82f6',
      borderRadius: '4px',
      overflow: 'hidden',
    },
    searchInput: {
      flex: 1,
      border: 'none',
      padding: '0 12px',
      outline: 'none',
      fontSize: '13px',
    },
    searchBtn: {
      backgroundColor: '#3b82f6',
      border: 'none',
      color: 'white',
      width: '45px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actions: {
      display: 'flex',
      gap: '10px',
    },
    loginBtn: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0 15px',
      height: '34px',
      borderRadius: '4px',
      fontWeight: '600',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
    },
    cartBtn: {
      backgroundColor: 'white',
      border: '1px solid #ddd',
      padding: '0 12px',
      height: '34px',
      borderRadius: '4px',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
      color: '#333',
    },
    nav: {
      backgroundColor: '#3b82f6',
      padding: '10px 5%',
    },
    navList: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap',
    },
    navItem: {
      color: 'white',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      whiteSpace: 'nowrap',
    },
    saleBadge: {
      backgroundColor: '#b31c1c',
      fontSize: '9px',
      padding: '1px 5px',
      borderRadius: '2px',
      fontWeight: 'bold',
      marginLeft: '2px',
    }
  };

  return (
    <header style={s.header}>
      {/* 1. TOP BAR */}
      <div style={s.topBar}>
        <span>💥 <b>DEAL GIÁ HỜI HÔM NAY - GIẢM CỰC SÂU</b></span>
        <div style={{display: 'flex', alignItems: 'center'}}>
          Chỉ còn: <span style={s.timerBox}>09:21:04</span>
        </div>
        <button style={s.dealBadge}>👉 NHẬN DEAL NGAY</button>
      </div>

      {/* 2. MAIN HEADER */}
      <div style={s.mainHeader}>
        {/* Click vào logo để về trang chủ */}
        <div style={s.logoWrapper} onClick={() => navigate('/')}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5px'}}>
            <div style={{width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '1px'}}></div>
            <div style={{width: '12px', height: '12px', backgroundColor: '#f97316', borderRadius: '1px'}}></div>
            <div style={{width: '12px', height: '12px', backgroundColor: '#f97316', borderRadius: '1px'}}></div>
            <div style={{width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '1px'}}></div>
          </div>
          <div>
            <div style={s.logoText}>KHOKHOAHOC</div>
            <div style={{color: '#f97316', fontWeight: 'bold', fontSize: '14px', marginTop: '-2px'}}>.ORG</div>
          </div>
        </div>

        <div style={s.searchBar}>
          <input style={s.searchInput} placeholder="Nhập tên khóa học hoặc giảng viên..." />
          <button style={s.searchBtn}>
            <Search size={16} />
          </button>
        </div>

        <div style={s.actions}>
          {/* 3. THÊM SỰ KIỆN onClick để chuyển sang /login */}
          <button style={s.loginBtn} onClick={() => navigate('/login')}>
            <UserCircle size={16} /> ĐĂNG NHẬP
          </button>
          
          <button style={s.cartBtn}>
            Giỏ hàng <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      <nav style={s.nav}>
        <ul style={s.navList}>
          <li style={s.navItem} onClick={() => navigate('/')}>Khóa Học Free</li>
          <li style={s.navItem}>
            Nâng Cấp Hội Viên <span style={s.saleBadge}>GIẢM GIÁ</span>
          </li>
          <li style={s.navItem}>COMBO</li>
          <li style={s.navItem}>Khóa học dưới 100k <small>▼</small></li>
          <li style={s.navItem}>Khóa học dưới 150k <small>▼</small></li>
          <li style={s.navItem}>Khóa học dưới 500k <small>▼</small></li>
          <li style={s.navItem}>Hướng dẫn</li>
          <li style={s.navItem}>Blog</li>
        </ul>
      </nav>
    </header>
  );
};

export default KHOKHOAHOCHeader;