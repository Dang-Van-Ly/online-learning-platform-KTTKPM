import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllCourses } from "../api/courseApi";
import { ChevronDown } from "lucide-react";

// --- CẤU HÌNH BỘ LỌC GIÁ ---
const PRICE_FILTERS = [
  { id: "free", label: "Khóa Học Miễn Phí", check: (course) => (course.type || "").toLowerCase() === "free" },
  { id: "under100k", label: "Khóa học dưới 100k", check: (course) => (course.price || 0) > 0 && (course.price || 0) < 100000 },
  { id: "under150k", label: "Khóa học dưới 150k", check: (course) => (course.price || 0) > 0 && (course.price || 0) < 150000 },
  { id: "under500k", label: "Khóa học dưới 500k", check: (course) => (course.price || 0) > 0 && (course.price || 0) < 500000 },
];

// --- DANH MỤC KHÓA HỌC ---
const CATEGORY_LIST = [
  "Kiếm Tiền Online - MMO",
  "AI - ChatGPT",
  "Crypto - Forex - Chứng Khoán",
  "Kinh Doanh - Marketing",
  "Data Analysis",
  "Copywriting",
  "Ads - Quảng Cáo",
  "SEO",
  "Tài Chính - Kế Toán",
  "Bất Động Sản",
  "Lập trình - Web",
  "Đồ họa - Thiết kế",
  "Edit Video",
  "Tiktok",
  "Tiếng Anh",
  "Tin học văn phòng",
];

// --- SẮP XẾP ---
const SORT_OPTIONS = [
  { value: "newest", label: "Sắp xếp theo mới nhất" },
  { value: "popular", label: "Sắp xếp theo mức độ phổ biến" },
  { value: "price_asc", label: "Sắp xếp theo giá: thấp đến cao" },
  { value: "price_desc", label: "Sắp xếp theo giá: cao đến thấp" },
];

// --- COURSE CARD DÙNG CHO TRANG FREE ---
const FreeCourseCard = ({ course }) => {
  const formatPrice = (price) => {
    return price ? new Intl.NumberFormat("vi-VN").format(price) + "đ" : "0đ";
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardImageWrap}>
        <img
          src={course.image}
          alt={course.name}
          style={styles.cardImage}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
        {(!course.price || course.price === 0) && (
          <span style={styles.freeBadge}>KHÓA HỌC</span>
        )}
      </div>
      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{course.name}</h3>
        <div style={styles.cardPriceRow}>
          <span style={styles.cardOldPrice}>
            {formatPrice(course.price ? course.price * 1.5 : 999000)}
          </span>
          <span style={styles.cardNewPrice}>{formatPrice(course.price)}</span>
        </div>
      </div>
    </div>
  );
};

// ============================
// TRANG KHÓA HỌC MIỄN PHÍ
// ============================
export default function FreeCourses() {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedPriceFilters, setSelectedPriceFilters] = useState(["free"]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Sort state
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Fetch data - chỉ lấy khóa học có type === "free"
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAllCourses();
      // Lọc chỉ lấy khóa học miễn phí (type === "free")
      const freeCourses = data.filter(
        (course) => (course.type || "").toLowerCase() === "free"
      );
      setAllCourses(freeCourses);
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- XỬ LÝ BỘ LỌC GIÁ ---
  const handlePriceFilter = (filterId) => {
    setSelectedPriceFilters((prev) => {
      if (prev.includes(filterId)) {
        return prev.filter((f) => f !== filterId);
      }
      return [...prev, filterId];
    });
    setCurrentPage(1);
  };

  // --- XỬ LÝ BỘ LỌC DANH MỤC ---
  const handleCategoryFilter = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
    setCurrentPage(1);
  };

  // --- BỎ CHỌN TẤT CẢ ---
  const clearAllFilters = () => {
    setSelectedPriceFilters([]);
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  // --- LỌC + SẮP XẾP ---
  const filteredAndSorted = useMemo(() => {
    let result = [...allCourses];

    // Lọc theo giá
    if (selectedPriceFilters.length > 0) {
      result = result.filter((course) =>
        selectedPriceFilters.some((filterId) => {
          const filterConfig = PRICE_FILTERS.find((f) => f.id === filterId);
          return filterConfig ? filterConfig.check(course) : true;
        })
      );
    }

    // Lọc theo danh mục (dựa trên course.type hoặc tên)
    if (selectedCategories.length > 0) {
      result = result.filter((course) => {
        const courseName = (course.name || "").toLowerCase();
        const courseType = (course.type || "").toLowerCase();
        return selectedCategories.some((cat) => {
          const catLower = cat.toLowerCase();
          return courseName.includes(catLower) || courseType.includes(catLower);
        });
      });
    }

    // Sắp xếp
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "popular":
        result.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "price_asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    return result;
  }, [allCourses, selectedPriceFilters, selectedCategories, sortBy]);

  // --- PHÂN TRANG ---
  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Sắp xếp";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc" }}>
      <Header />

      <main style={styles.main}>
        {/* TIÊU ĐỀ */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Khóa Học Miễn Phí</h1>
          {/* SẮP XẾP */}
          <div style={styles.sortContainer}>
            <button
              style={styles.sortButton}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span>{currentSortLabel}</span>
              <ChevronDown size={16} />
            </button>
            {showSortDropdown && (
              <div style={styles.sortDropdown}>
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    style={{
                      ...styles.sortOption,
                      ...(sortBy === option.value ? styles.sortOptionActive : {}),
                    }}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                      setCurrentPage(1);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={styles.contentLayout}>
          {/* ============ SIDEBAR ============ */}
          <aside style={styles.sidebar}>
            {/* Giá Khóa Học */}
            <div style={styles.filterSection}>
              <h3 style={styles.filterTitle}>Giá Khóa Học</h3>
              <button style={styles.clearBtn} onClick={clearAllFilters}>
                ✕ Bỏ chọn
              </button>
              <div style={styles.filterList}>
                {PRICE_FILTERS.map((filter) => (
                  <label key={filter.id} style={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={selectedPriceFilters.includes(filter.id)}
                      onChange={() => handlePriceFilter(filter.id)}
                      style={styles.checkbox}
                    />
                    <span
                      style={{
                        ...styles.filterText,
                        ...(selectedPriceFilters.includes(filter.id)
                          ? styles.filterTextActive
                          : {}),
                      }}
                    >
                      {filter.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Danh Mục Khóa Học */}
            <div style={styles.filterSection}>
              <h3 style={styles.filterTitle}>Danh Mục Khóa Học</h3>
              <div style={styles.filterList}>
                {CATEGORY_LIST.map((cat) => (
                  <label key={cat} style={styles.filterLabel}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryFilter(cat)}
                      style={styles.checkbox}
                    />
                    <span
                      style={{
                        ...styles.filterText,
                        ...(selectedCategories.includes(cat)
                          ? styles.filterTextActive
                          : {}),
                      }}
                    >
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ============ GRID KHÓA HỌC ============ */}
          <section style={styles.courseGrid}>
            {loading ? (
              <div style={styles.loadingGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} style={styles.skeleton}></div>
                ))}
              </div>
            ) : paginatedCourses.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={{ fontSize: "18px", color: "#6b7280" }}>
                  Không tìm thấy khóa học phù hợp với bộ lọc.
                </p>
                <button style={styles.resetBtn} onClick={clearAllFilters}>
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div style={styles.grid}>
                  {paginatedCourses.map((course) => (
                    <FreeCourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* PHÂN TRANG */}
                {totalPages > 1 && (
                  <div style={styles.pagination}>
                    <button
                      style={{
                        ...styles.pageBtn,
                        ...(currentPage === 1 ? styles.pageBtnDisabled : {}),
                      }}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          style={{
                            ...styles.pageBtn,
                            ...(currentPage === page
                              ? styles.pageBtnActive
                              : {}),
                          }}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      style={{
                        ...styles.pageBtn,
                        ...(currentPage === totalPages
                          ? styles.pageBtnDisabled
                          : {}),
                      }}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Sau →
                    </button>
                  </div>
                )}

                <div style={styles.resultCount}>
                  Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredAndSorted.length
                  )}{" "}
                  / {filteredAndSorted.length} khóa học
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ============================
// STYLES
// ============================
const styles = {
  main: {
    flexGrow: 1,
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px 20px",
  },

  // --- Page Header ---
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  pageTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#1e293b",
    margin: 0,
    letterSpacing: "-0.3px",
  },

  // --- Sort ---
  sortContainer: {
    position: "relative",
  },
  sortButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  sortDropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "4px",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    zIndex: 100,
    minWidth: "260px",
    overflow: "hidden",
  },
  sortOption: {
    display: "block",
    width: "100%",
    padding: "12px 18px",
    border: "none",
    backgroundColor: "#fff",
    textAlign: "left",
    fontSize: "13px",
    color: "#374151",
    cursor: "pointer",
    transition: "background 0.15s",
    borderBottom: "1px solid #f1f5f9",
  },
  sortOptionActive: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: "600",
  },

  // --- Layout ---
  contentLayout: {
    display: "flex",
    gap: "28px",
    alignItems: "flex-start",
  },

  // --- Sidebar ---
  sidebar: {
    width: "240px",
    flexShrink: 0,
    position: "sticky",
    top: "20px",
  },
  filterSection: {
    marginBottom: "28px",
  },
  filterTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 6px 0",
    paddingBottom: "8px",
    borderBottom: "2px solid #e2e8f0",
  },
  clearBtn: {
    border: "none",
    background: "none",
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "4px 0",
    marginBottom: "8px",
    display: "block",
  },
  filterList: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  filterLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "7px 4px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#3b82f6",
    cursor: "pointer",
    flexShrink: 0,
  },
  filterText: {
    fontSize: "13px",
    color: "#4b5563",
    lineHeight: "1.3",
  },
  filterTextActive: {
    color: "#3b82f6",
    fontWeight: "600",
  },

  // --- Course Grid ---
  courseGrid: {
    flex: 1,
    minWidth: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  skeleton: {
    height: "280px",
    backgroundColor: "#e2e8f0",
    borderRadius: "10px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  resetBtn: {
    marginTop: "16px",
    padding: "10px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // --- Card ---
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    border: "2px solid #fca5a5",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  cardImageWrap: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
  },
  cardImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s",
  },
  freeBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "3px",
    letterSpacing: "0.5px",
  },
  cardBody: {
    padding: "14px 16px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 12px 0",
    lineHeight: "1.5",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "39px",
  },
  cardPriceRow: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  cardOldPrice: {
    fontSize: "13px",
    color: "#9ca3af",
    textDecoration: "line-through",
  },
  cardNewPrice: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#ef4444",
  },

  // --- Pagination ---
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    marginTop: "32px",
    flexWrap: "wrap",
  },
  pageBtn: {
    padding: "8px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#374151",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  pageBtnActive: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderColor: "#3b82f6",
    fontWeight: "700",
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  resultCount: {
    textAlign: "center",
    marginTop: "14px",
    fontSize: "13px",
    color: "#6b7280",
  },
};
