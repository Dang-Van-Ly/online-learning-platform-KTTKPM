import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCourseById, getAllCourses } from "../api/courseApi";
import { ShoppingCart, PlayCircle, Star, MessageCircle, FileText, CheckCircle, Clock } from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCourses, setNewCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("desc");

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      const data = await getCourseById(id);
      setCourse(data);
      
      // Lấy thêm vài khóa học cho phần "Khóa học mới" bên phải
      const allData = await getAllCourses();
      // Sắp xếp ID giảm dần (mới nhất) và lấy 3 khóa học
      const sorted = allData.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);
      setNewCourses(sorted);
      
      setLoading(false);
    };
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const formatPrice = (price) => {
    return price ? new Intl.NumberFormat("vi-VN").format(price) + "đ" : "0đ";
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p>Đang tải dữ liệu...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <h2>Không tìm thấy khóa học</h2>
          <button onClick={() => navigate("/")} style={styles.btnSecondary}>Quay về trang chủ</button>
        </main>
        <Footer />
      </div>
    );
  }

  const isFree = (course.type || "").toLowerCase() === "free" || course.price === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header />

      <main style={styles.main}>
        {/* ================= HERO SECTION ================= */}
        <div style={styles.heroContainer}>
          {/* CỘT TRÁI - ẢNH */}
          <div style={styles.heroLeft}>
            <div style={styles.imageWrap}>
              <img
                src={course.image || "https://via.placeholder.com/600x400?text=No+Image"}
                alt={course.name}
                style={styles.courseImage}
              />
            </div>
            <div style={styles.actionButtonsRow}>
              <button style={styles.btnExchange}>
                <MessageCircle size={16} /> Trao đổi KH
              </button>
              <button style={styles.btnTrial}>
                <PlayCircle size={16} /> Học Thử
              </button>
            </div>
          </div>

          {/* CỘT GIỮA - THÔNG TIN CHI TIẾT */}
          <div style={styles.heroCenter}>
            <h1 style={styles.courseTitle}>{course.name}</h1>
            
            <div style={styles.priceContainer}>
              <span style={styles.currentPrice}>{isFree ? "Miễn Phí" : formatPrice(course.price)}</span>
              {!isFree && (
                <span style={styles.oldPrice}>{formatPrice(course.price ? course.price * 1.5 : 999000)}</span>
              )}
            </div>

            <table style={styles.infoTable}>
              <tbody>
                <tr>
                  <td style={styles.infoLabel}><Clock size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}}/>Thời lượng</td>
                  <td style={styles.infoValue}>59 Bài Giảng</td>
                </tr>
                <tr>
                  <td style={styles.infoLabel}><FileText size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'4px'}}/>Loại khóa học</td>
                  <td style={styles.infoValue}>{isFree ? "Khóa học Miễn Phí" : "Khóa học Online"}</td>
                </tr>
              </tbody>
            </table>

            <div style={styles.ctaContainer}>
              <button style={styles.btnUpgrade}>
                <UserCircle size={18} /> Nâng Cấp Gói Hội Viên Ngay
              </button>
              <button style={styles.btnCommunity}>
                <Star size={18} /> Nhóm Cộng Đồng Kho Khóa Học
              </button>
              
              <div style={styles.buyButtonsRow}>
                <button style={styles.btnAddToCart}>
                  <ShoppingCart size={18} /> Thêm vào giỏ
                </button>
                <button style={styles.btnBuyNow}>
                  Thanh toán ngay
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI - FEATURES */}
          <div style={styles.heroRight}>
            <div style={styles.featureBox}>
              <div style={styles.featureIconWrap}><FileText size={24} color="#ef4444" /></div>
              <div style={styles.featureTextWrap}>
                <h4 style={styles.featureTitle}>Đầy Đủ Bài Giảng</h4>
                <p style={styles.featureDesc}>Cam kết video bài giảng và tài liệu giống mô tả</p>
              </div>
            </div>
            <div style={styles.featureBox}>
              <div style={styles.featureIconWrap}><PlayCircle size={24} color="#3b82f6" /></div>
              <div style={styles.featureTextWrap}>
                <h4 style={styles.featureTitle}>Học Online Tiện Lợi</h4>
                <p style={styles.featureDesc}>Học online trên Website bằng điện thoại hoặc máy tính</p>
              </div>
            </div>
            <div style={styles.featureBox}>
              <div style={styles.featureIconWrap}><CheckCircle size={24} color="#eab308" /></div>
              <div style={styles.featureTextWrap}>
                <h4 style={styles.featureTitle}>Kích Hoạt Nhanh</h4>
                <p style={styles.featureDesc}>Nhận khóa học trong vòng 3-5 giây</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CONTENT & SIDEBAR ================= */}
        <div style={styles.contentLayout}>
          {/* NỘI DUNG MÔ TẢ */}
          <div style={styles.mainContent}>
            <div style={styles.tabsContainer}>
              <button
                style={{ ...styles.tabBtn, ...(activeTab === "desc" ? styles.tabBtnActive : {}) }}
                onClick={() => setActiveTab("desc")}
              >
                Mô tả
              </button>
              <button
                style={{ ...styles.tabBtn, ...(activeTab === "learn" ? styles.tabBtnActive : {}) }}
                onClick={() => setActiveTab("learn")}
              >
                Vào học
              </button>
            </div>
            
            <div style={styles.tabContent}>
              {activeTab === "desc" && (
                <div style={styles.descriptionBody}>
                  {course.description ? (
                    <div dangerouslySetInnerHTML={{ __html: course.description }} />
                  ) : (
                    <div>
                      <h3 style={{color: '#d97706'}}>⚡ Vì Sao Bạn Nên Học Khóa Này?</h3>
                      <p>Khóa học này cung cấp kiến thức nền tảng và chuyên sâu về lĩnh vực bạn đang tìm kiếm. Tham gia ngay để nâng cao kỹ năng.</p>
                      
                      <h3 style={{color: '#ec4899'}}>🎯 Học Viên Tham Gia Sẽ Được:</h3>
                      <ul>
                        <li>Tự xây dựng được chiến lược phù hợp với bản thân.</li>
                        <li>Hiểu rõ quy trình và cách thức hoạt động.</li>
                        <li>Nắm vững các công cụ và kỹ thuật mới nhất.</li>
                      </ul>

                      <h3 style={{color: '#6366f1'}}>🎓 Khóa Học Sẽ Phù Hợp Với Ai?</h3>
                      <ul>
                        <li>Người muốn bắt đầu nhưng chưa có kiến thức nền.</li>
                        <li>Người muốn nâng cao tư duy và kỹ năng.</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "learn" && (
                <div style={{ padding: "40px 20px", textAlign: "center" }}>
                  <h3>Nội dung khóa học đang được cập nhật...</h3>
                  <button style={styles.btnSecondary} onClick={() => navigate('/')}>Trở về trang chủ</button>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR BÊN PHẢI */}
          <div style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>Khóa học mới</h3>
            <div style={styles.sidebarList}>
              {newCourses.map(c => (
                <div key={c.id} style={styles.sidebarItem} onClick={() => navigate(`/course/${c.id}`)}>
                  <img src={c.image || "https://via.placeholder.com/100x80"} alt={c.name} style={styles.sidebarItemImage} />
                  <div style={styles.sidebarItemInfo}>
                    <h4 style={styles.sidebarItemTitle}>{c.name}</h4>
                    <div style={styles.sidebarItemPrice}>
                      <span style={{textDecoration: 'line-through', color: '#9ca3af', fontSize: '11px', marginRight: '6px'}}>
                        {formatPrice(c.price ? c.price * 1.5 : 999000)}
                      </span>
                      <span style={{color: '#3b82f6', fontWeight: 'bold', fontSize: '13px'}}>
                        {formatPrice(c.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

// Icon UserCircle - placeholder since it wasn't imported from lucide-react in the top section
const UserCircle = ({ size, color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>
);

const styles = {
  main: {
    flexGrow: 1,
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px 20px",
  },
  
  // --- HERO SECTION ---
  heroContainer: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 0.8fr",
    gap: "20px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    marginBottom: "30px",
  },

  // Hero Left
  heroLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  imageWrap: {
    width: "100%",
    borderRadius: "8px",
    overflow: "hidden",
    border: "2px solid #10b981", // Viền xanh như thiết kế
  },
  courseImage: {
    width: "100%",
    aspectRatio: "16/9",
    objectFit: "cover",
    display: "block",
  },
  actionButtonsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  btnExchange: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#eab308",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  btnTrial: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#65a30d",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },

  // Hero Center
  heroCenter: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  courseTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 10px 0",
    lineHeight: "1.3",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },
  currentPrice: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#3b82f6",
  },
  oldPrice: {
    fontSize: "16px",
    color: "#9ca3af",
    textDecoration: "line-through",
    fontWeight: "600",
  },
  infoTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "10px",
  },
  infoLabel: {
    padding: "8px 0",
    color: "#6b7280",
    fontSize: "14px",
    borderBottom: "1px dashed #e5e7eb",
  },
  infoValue: {
    padding: "8px 0",
    color: "#1f2937",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "right",
    borderBottom: "1px dashed #e5e7eb",
  },
  ctaContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "auto",
  },
  btnUpgrade: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#fff",
    color: "#ef4444",
    border: "1px solid #ef4444",
    padding: "12px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },
  btnCommunity: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#fff",
    color: "#1f2937",
    border: "1px solid #d1d5db",
    padding: "12px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  buyButtonsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  btnAddToCart: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#4b5563",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  btnBuyNow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },

  // Hero Right
  heroRight: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  featureBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "12px",
    borderRadius: "8px",
  },
  featureIconWrap: {
    width: "40px",
    height: "40px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    flexShrink: 0,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 4px 0",
  },
  featureDesc: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
    lineHeight: "1.4",
  },

  // --- CONTENT & SIDEBAR ---
  contentLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: "30px",
  },

  // Main Content (Tabs)
  mainContent: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  tabsContainer: {
    display: "flex",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f1f5f9",
  },
  tabBtn: {
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#6b7280",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    position: "relative",
  },
  tabBtnActive: {
    color: "#1f2937",
    backgroundColor: "#fff",
    borderTop: "2px solid #3b82f6",
  },
  tabContent: {
    padding: "24px",
  },
  descriptionBody: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#374151",
    // Các style CSS cho các thẻ H3, ul, li bên trong innerHTML có thể thêm class nếu cần
  },

  // Sidebar
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#10b981", // Xanh lá
    margin: 0,
    paddingBottom: "12px",
    borderBottom: "2px solid #10b981",
  },
  sidebarList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sidebarItem: {
    display: "flex",
    gap: "12px",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  sidebarItemImage: {
    width: "80px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  sidebarItemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  sidebarItemTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0 0 6px 0",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    lineHeight: "1.4",
  },

  // Utils
  btnSecondary: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "20px",
  }
};
