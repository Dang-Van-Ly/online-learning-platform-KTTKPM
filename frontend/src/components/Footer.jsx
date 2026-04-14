import React from 'react';
import { Award, Zap, RefreshCw, Monitor, ChevronUp } from 'lucide-react';

const KHOKHOAHOCFooter = () => {
  const s = {
    footerWrapper: {
      width: '100%',
      backgroundColor: '#f5f5f5',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '30px 0 20px 0',
      marginTop: '30px',
    },
    utilityContainer: {
      display: 'flex',          // Chuyển sang flex để dàn hàng ngang
      flexWrap: 'wrap',        // Tự xuống dòng nếu màn hình nhỏ
      justifyContent: 'center', // Căn giữa các card
      gap: '15px',
      maxWidth: '1200px',
      margin: '0 auto 30px auto',
      padding: '0 15px',
    },
    card: {
      backgroundColor: '#fff',
      padding: '12px 20px',    // Padding vừa phải để card mỏng (thấp)
      borderRadius: '4px',     // Bo góc nhẹ giống hình
      display: 'flex',
      flexDirection: 'row',    // Icon bên trái, chữ bên phải
      alignItems: 'center',
      gap: '15px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      flex: '1 1 250px',       // Độ rộng linh hoạt, tối thiểu 250px
      maxWidth: '180px',       // Giới hạn độ rộng để không bị quá dài
      minHeight: '70px',       // Chiều cao thấp giống trong hình
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,           // Không cho icon bị bóp méo
    },
    textWrapper: {
      textAlign: 'left',       // Chữ căn trái
    },
    cardTitle: {
      margin: 0,
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#333',
    },
    cardDesc: {
      margin: '2px 0 0 0',
      fontSize: '12px',
      color: '#666',
      lineHeight: '1.4',
    },
    bottomBar: {
      borderTop: '1px solid #f4f2f2',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 10px 0 15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    brandInfo: {
      flex: 1,
    },
    backToTop: {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      border: '1px solid #ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#999',
      marginRight: '15px',
    },
    contactInfo: {
      textAlign: 'right',
      fontSize: '13px',
      color: '#555',
      lineHeight: '1.8',
    },
    highlightText: {
      color: '#f97316',
      fontWeight: '500',
    }
  };

  return (
    <footer style={s.footerWrapper}>
      <div style={s.utilityContainer}>
        {/* Card 1 */}
        <div style={s.card}>
          <div style={s.iconWrapper}>
             <Award size={35} color="#f97316" strokeWidth={1.5} />
          </div>
          <div style={s.textWrapper}>
            <h4 style={s.cardTitle}>Uy tín chất lượng</h4>
            <p style={s.cardDesc}>Hoàn tiền nếu khóa học không như mô tả</p>
          </div>
        </div>

        {/* Card 2 */}
        <div style={s.card}>
          <div style={s.iconWrapper}>
            <Zap size={35} color="#4caf50" strokeWidth={1.5} />
          </div>
          <div style={s.textWrapper}>
            <h4 style={s.cardTitle}>Kích hoạt nhanh</h4>
            <p style={s.cardDesc}>Kích hoạt khóa học tự động</p>
          </div>
        </div>

        {/* Card 3 */}
        <div style={s.card}>
          <div style={s.iconWrapper}>
            <RefreshCw size={35} color="#3b82f6" strokeWidth={1.5} />
          </div>
          <div style={s.textWrapper}>
            <h4 style={s.cardTitle}>Update liên tục</h4>
            <p style={s.cardDesc}>Cập nhật 7-15 khóa học mới hằng tuần</p>
          </div>
        </div>

        {/* Card 4 */}
        <div style={s.card}>
          <div style={s.iconWrapper}>
            <Monitor size={35} color="#ef4444" strokeWidth={1.5} />
          </div>
          <div style={s.textWrapper}>
            <h4 style={s.cardTitle}>Học online tiện lợi</h4>
            <p style={s.cardDesc}>Học bằng điện thoại hoặc máy tính</p>
          </div>
        </div>
      </div>

      <div style={s.bottomBar}>
        <div style={s.backToTop} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <ChevronUp size={20} />
        </div>

        <div style={s.brandInfo}>
          <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>khokhoahoc.org</div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>
            Copyright © 2021 - Chuyên mua bán khóa học giá rẻ
          </div>
        </div>

        <div style={s.contactInfo}>
          <div>SĐT (Zalo): <span style={s.highlightText}>0949059280</span></div>
          <div>Quy định: <span style={{color: '#f97316'}}>Sử dụng tài khoản</span></div>
          <div>Email: <span style={{color: '#f97316'}}>admin@khokhoahoc.co</span></div>
        </div>
      </div>
    </footer>
  );
};

export default KHOKHOAHOCFooter;