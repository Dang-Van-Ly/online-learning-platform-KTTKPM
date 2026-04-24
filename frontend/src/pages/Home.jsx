import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetch = async () => {
      const data = await getAllCourses();
      setCourses(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const getSectionData = (index) => {
    const start = index * 4;
    return courses.slice(start, start + 4);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto w-full px-4 py-6">

        {/* CATEGORY */}
        <div className="grid grid-cols-2 gap-1 mb-10 bg-blue-500 text-white">
          {CATEGORIES.map((pair, i) => (
            <React.Fragment key={i}>
              <div className="p-2 text-sm">{pair[0]}</div>
              <div className="p-2 text-sm">{pair[1]}</div>
            </React.Fragment>
          ))}
        </div>

        {/* TOP COURSES */}
        <h2 className="font-bold mb-4">Top khóa học</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {loading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 animate-pulse" />
              ))
            : courses.slice(0, 3).map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
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