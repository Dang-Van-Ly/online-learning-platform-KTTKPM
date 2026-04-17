import React, { useState, useEffect } from "react";
// Layout
import Header from "../components/Header";
import Footer from "../components/Footer";

// API
import { getAllCourses } from "../api/courseApi";

// --- DATA CẤU HÌNH CỐ ĐỊNH (SIDEBAR) ---
const CATEGORIES = [
  ["Ads", "Lập trình - Web"], ["SEO", "Copywriting"],
  ["AI - ChatGPT", "Data Analysis"], ["Tiktok", "Bất động sản"],
  ["Shopee", "Kiếm tiền online"], ["Tiếng Anh", "Tin học văn phòng"],
  ["Tài Chính - Kế Toán", "Crypto - Forex - Chứng khoán"], ["Phòng the", "Đồ họa - Thiết kế"],
  ["Edit Video", "Kinh doanh - Marketing"], ["Phong Thủy", "Tiếng Trung - Nhật - Hàn"],
  ["Khóa học khác", "Ôn Thi THPT"],
];

// --- CẤU HÌNH TIÊU ĐỀ CÁC SECTION ---
const SECTION_CONFIGS = [
  { title: "Làm Chủ", highlight: "THU NHẬP THỤ ĐỘNG", color: "text-purple-600", sub: "Các bí kíp MMO, Affiliate... đã kiểm chứng" },
  { title: "Kinh Doanh &", highlight: "MARKETING THỰC CHIẾN", color: "text-orange-500", sub: "Xây dựng chiến lược bán hàng bùng nổ" },
  { title: "Bí Kíp", highlight: "LÀM CHỦ AI Từ A-Z", color: "text-blue-500", sub: "AI không thay thế bạn - Chỉ thay thế người không biết dùng AI" },
  { title: "Xây Dựng", highlight: "KÊNH TIKTOK TRIỆU VIEW", color: "text-green-500", sub: "Từ edit video đến săn xu hướng ngàn đơn" },
];

// --- COMPONENTS NHỎ ---

const CourseCard = ({ course }) => {
  const formatPrice = (price) => {
    return price ? new Intl.NumberFormat('vi-VN').format(price) + 'đ' : '0đ';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow group cursor-pointer h-full">
      <div className="relative overflow-hidden bg-gray-100">
        <img 
          src={course.image} 
          alt={course.name} 
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
        />
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">
          {course.type || "PAID"}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-grow text-center md:text-left">
        <h3 className="text-[14px] font-bold text-gray-800 line-clamp-2 mb-3 h-10 leading-tight">
          {course.name}
        </h3>
        <div className="mt-auto flex flex-col items-center md:items-start">
          <span className="text-gray-400 line-through text-[11px]">
            {formatPrice(course.price * 1.5)}
          </span>
          <span className="text-red-500 font-bold text-lg">
            {formatPrice(course.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, highlight, highlightColor, subtitle }) => (
  <div className="flex justify-between items-end mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl font-black text-gray-800 uppercase tracking-tight">
        {title} <span className={highlightColor}>{highlight}</span>
      </h2>
      <p className="text-gray-500 text-sm mt-1 font-medium">{subtitle}</p>
    </div>
    <button className="w-10 h-10 border border-blue-300 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
      <span className="text-xl">→</span>
    </button>
  </div>
);

// --- TRANG CHỦ CHÍNH ---

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllCourses();
      // Xáo trộn nhẹ để mỗi lần xem có cảm giác mới mẻ (tùy chọn)
      const shuffled = [...data].sort(() => 0.5 - Math.random());
      setCourses(shuffled);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Hàm chia dữ liệu từ DB vào các Section (mỗi section 4 cái)
  const getSectionData = (index) => {
    const start = 3 + (index * 4); // Section 1 bắt đầu sau 3 cái ở Top
    return courses.slice(start, start + 4);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-gray-900">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 md:px-6">
        
        {/* SECTION 1: SIDEBAR & TOP COURSES */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <aside className="lg:w-1/3">
            <h2 className="text-blue-900 font-black text-center mb-5 text-xl uppercase italic tracking-widest">
              Danh mục khóa học
            </h2>
            <div className="grid grid-cols-2 gap-[2px] bg-blue-400 border border-blue-400 rounded-sm overflow-hidden shadow-sm">
              {CATEGORIES.map((pair, index) => (
                <React.Fragment key={index}>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-3 text-[13px] font-semibold transition-colors text-left pl-4">
                    {pair[0]}
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-3 text-[13px] font-semibold transition-colors text-left pl-4">
                    {pair[1]}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </aside>

          <section className="lg:w-2/3">
            <h2 className="text-blue-900 font-black text-center mb-5 text-xl uppercase italic tracking-widest">
              Top khóa học mới nhất
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>)
              ) : (
                courses.slice(0, 3).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              )}
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className={`h-2 rounded-full transition-all ${i === 4 ? 'w-10 bg-blue-500' : 'w-2 bg-gray-300'}`}></span>
              ))}
            </div>
          </section>
        </div>

        {/* BANNER QUẢNG CÁO */}
        <div className="mb-16 border-[3px] border-blue-400 rounded-sm p-8 text-center bg-white relative shadow-sm">
          <h2 className="text-blue-700 font-black text-2xl md:text-4xl mb-3 tracking-tighter uppercase">
             ĐANG KẾT NỐI VỚI DỮ LIỆU THỰC ({courses.length} Khóa học)
          </h2>
          <p className="text-gray-500 max-w-4xl mx-auto text-base md:text-lg font-medium leading-relaxed">
            Dữ liệu được lấy trực tiếp từ Docker MariaDB thông qua API Spring Boot.
          </p>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-blue-500"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-blue-500"></div>
        </div>

        {/* SECTION 3: CÁC KHỐI KHÓA HỌC DƯỚI ĐÂY LẤY TỪ DATA DB */}
        {!loading && SECTION_CONFIGS.map((config, idx) => {
          const sectionCourses = getSectionData(idx);
          if (sectionCourses.length === 0) return null;

          return (
            <div key={idx} className="mb-16">
              <SectionHeader 
                title={config.title} 
                highlight={config.highlight} 
                highlightColor={config.color}
                subtitle={config.sub}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sectionCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i === 1 ? 'w-8 bg-blue-500' : 'w-1.5 bg-gray-300'}`}></span>
                ))}
              </div>
            </div>
          );
        })}

      </main>

      <Footer />
    </div>
  );
}