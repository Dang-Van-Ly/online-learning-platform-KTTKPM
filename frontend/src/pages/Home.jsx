import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../api/courseApi";

// --- DATA ---
const CATEGORIES = [
  ["Ads", "Lập trình - Web"], ["SEO", "Copywriting"],
  ["AI - ChatGPT", "Data Analysis"], ["Tiktok", "Bất động sản"],
  ["Shopee", "Kiếm tiền online"], ["Tiếng Anh", "Tin học văn phòng"],
  ["Tài Chính - Kế Toán", "Crypto - Forex - Chứng khoán"],
  ["Phòng the", "Đồ họa - Thiết kế"],
  ["Edit Video", "Kinh doanh - Marketing"],
  ["Phong Thủy", "Tiếng Trung - Nhật - Hàn"],
  ["Khóa học khác", "Ôn Thi THPT"],
];

const FLAT_CATEGORIES = CATEGORIES.flat();

const SECTION_CONFIGS = [
  { title: "Làm Chủ", highlight: "THU NHẬP THỤ ĐỘNG", color: "text-purple-600", sub: "Các bí kíp MMO, Affiliate..." },
  { title: "Kinh Doanh &", highlight: "MARKETING THỰC CHIẾN", color: "text-orange-500", sub: "Chiến lược bán hàng" },
  { title: "Bí Kíp", highlight: "LÀM CHỦ AI", color: "text-blue-500", sub: "AI từ cơ bản đến nâng cao" },
  { title: "Xây Dựng", highlight: "TIKTOK TRIỆU VIEW", color: "text-green-500", sub: "Edit video + trend" },
];

// --- COURSE CARD ---
const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const formatPrice = (price) =>
    price ? new Intl.NumberFormat("vi-VN").format(price) + "đ" : "0đ";

  return (
    <div
      onClick={() => navigate(`/course/${course.id}`)}
      className="bg-white rounded-lg shadow-sm overflow-hidden border flex flex-col hover:shadow-md cursor-pointer"
    >
      <div className="relative">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-44 object-cover"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/400x300?text=No+Image")
          }
        />
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded">
          {course.type || "PAID"}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-bold line-clamp-2">{course.name}</h3>
        {course.category && (
          <div className="text-xs text-gray-500 mt-2 line-clamp-1">
            {course.category}
          </div>
        )}

        <div className="mt-auto">
          <div className="text-gray-400 line-through text-xs">
            {formatPrice(course.price * 1.5)}
          </div>
          <div className="text-red-500 font-bold">
            {formatPrice(course.price)}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SECTION HEADER ---
const SectionHeader = ({ title, highlight, highlightColor, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-black">
      {title} <span className={highlightColor}>{highlight}</span>
    </h2>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

// --- HOME ---
export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getAllCourses("");
      // Sắp xếp khóa học mới nhất dựa trên id (giả định id cao hơn là mới hơn)
      const sortedData = [...data].sort((a, b) => (b.id || 0) - (a.id || 0));
      setCourses(sortedData);
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses;
  }, [courses]);

  const getSectionData = (index) => {
    const start = index * 4;
    return filteredCourses.slice(start, start + 4);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto w-full px-4 py-6">

        {/* TOP SECTION (Categories & Latest Courses) */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8 flex flex-col lg:flex-row gap-8">
          {/* CATEGORY */}
          <div className="lg:w-[35%]">
            <h2 className="text-lg font-black text-blue-800 text-center uppercase mb-5 tracking-wide">Danh mục khóa học</h2>
            <div className="grid grid-cols-2 gap-2">
              {FLAT_CATEGORIES.map((category, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/filtered-courses?category=${encodeURIComponent(category)}`)}
                  className="rounded border border-blue-500 px-3 py-2 text-[13px] font-semibold text-center transition-all duration-150 bg-blue-500 text-white hover:bg-blue-600 hover:shadow"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* TOP COURSES */}
          <div className="lg:w-[65%]">
            <h2 className="text-lg font-black text-blue-800 text-center uppercase mb-5 tracking-wide">Top khóa học mới nhất</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse border border-gray-200" />
                  ))
                : courses.slice(0, 3).map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
            </div>
            
            {/* Pagination Dots Indicator Placeholder */}
            {!loading && courses.length > 0 && (
               <div className="flex justify-center gap-2 mt-6 mb-8">
                 <div className="w-6 h-2 bg-blue-500 rounded-full"></div>
                 <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                 <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                 <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                 <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
               </div>
            )}

            {/* INFO BANNER inside Right Column */}
            <div className="bg-blue-50 border-l-4 border-blue-500 shadow-sm py-6 px-4 text-center mt-auto">
              <h2 className="text-xl font-black text-blue-800 mb-2 uppercase tracking-wide">KHO KHÓA HỌC – SHARE HƠN 5000 KHÓA HỌC ONLINE</h2>
              <p className="text-gray-600 text-[14px] max-w-2xl mx-auto leading-relaxed">
                Tổng kho khóa học online lớn nhất hiện nay, uy tín, chất lượng và nhanh chóng.<br/>
                Chúng tôi liên tục cập nhật các khóa học mới đáp ứng nhu cầu của các bạn.
              </p>
            </div>
          </div>
        </div>

        {/* LARGE IMAGE BANNER */}
        <div className="mb-12 w-full rounded-xl overflow-hidden shadow-md">
          <div className="w-full h-[250px] md:h-[300px] flex items-center justify-center text-white relative bg-[#0b1f42]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f2856] via-[#1a4085] to-[#0f2856] opacity-90"></div>
            
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white"></div>
                <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full border-4 border-white"></div>
            </div>

            <div className="relative z-10 text-center flex flex-col items-center justify-center w-full px-4">
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 text-white drop-shadow-lg tracking-tight">HỌC GÌ CŨNG CÓ</h2>
               <div className="text-xl md:text-2xl mb-6 font-medium text-blue-200">KHO KHÓA HỌC KHỔNG LỒ</div>
               
               <div className="bg-[#cc0000] border-2 border-yellow-400 rounded-full px-6 py-2 mb-6 shadow-[0_0_15px_rgba(255,215,0,0.5)] transform -rotate-2">
                 <div className="text-yellow-400 font-black text-2xl md:text-3xl">CHỈ TỪ 1.100đ / KHÓA</div>
               </div>
               
               <button className="bg-gradient-to-b from-yellow-300 to-yellow-500 text-red-800 font-black px-10 py-3 rounded-full text-lg shadow-[0_4px_14px_rgba(0,0,0,0.39)] hover:from-yellow-400 hover:to-yellow-600 transform transition hover:scale-105 border border-yellow-200">
                 NHẬN ƯU ĐÃI NGAY! ❯
               </button>
            </div>
          </div>
        </div>

        {/* SECTIONS */}
        {!loading &&
          SECTION_CONFIGS.map((sec, i) => {
            const data = getSectionData(i);
            if (!data.length) return null;

            return (
              <div key={i} className="mb-10">
                <SectionHeader
                  title={sec.title}
                  highlight={sec.highlight}
                  highlightColor={sec.color}
                  subtitle={sec.sub}
                />

                <div className="grid md:grid-cols-4 gap-4">
                  {data.map((c) => (
                    <CourseCard key={c.id} course={c} />
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