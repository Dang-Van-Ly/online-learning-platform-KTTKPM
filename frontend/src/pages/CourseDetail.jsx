import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCourseById, getAllCourses } from "../api/courseApi";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [tab, setTab] = useState("desc");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCourseById(id);
      setCourse(data);

      const all = await getAllCourses();
      setCourses(all);
    };
    fetchData();
  }, [id]);

  if (!course) return <div className="p-10">Loading...</div>;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      {/* TOP */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <img
            src={course.image}
            className="w-full h-[300px] object-cover rounded mb-4"
          />

          <h1 className="text-2xl font-bold mb-2">{course.name}</h1>

          {/* BUTTONS */}
          <div className="flex gap-3 mb-4">
            <button className="bg-orange-500 text-white px-4 py-2 rounded">
              Trao đổi KH
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Học thử
            </button>
          </div>

          {/* TAB */}
          <div className="border-b flex gap-6 mb-4">
            <button
              onClick={() => setTab("desc")}
              className={tab === "desc" ? "font-bold border-b-2 border-blue-500 pb-2" : ""}
            >
              Mô tả
            </button>

            <button
              onClick={() => setTab("content")}
              className={tab === "content" ? "font-bold border-b-2 border-blue-500 pb-2" : ""}
            >
              Nội dung
            </button>
          </div>

          {/* TAB CONTENT */}
          {tab === "desc" && (
            <div>
              <h2 className="text-xl font-bold mb-3 text-orange-500">
                Bí quyết dùng người đúng việc
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                {course.description || "Chưa có mô tả"}
              </p>

              <img src={course.image} className="w-full rounded mb-4" />

              {/* ƯU NHƯỢC */}
              <div className="grid grid-cols-2 gap-4 border p-4 rounded">
                <div>
                  <h3 className="font-bold text-green-600">Ưu điểm</h3>
                  <ul className="text-sm mt-2">
                    <li>✔ Video HD</li>
                    <li>✔ Tài liệu đầy đủ</li>
                    <li>✔ Giá rẻ</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-orange-500">Nhược điểm</h3>
                  <ul className="text-sm mt-2">
                    <li>✖ Không hỗ trợ trực tiếp</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === "content" && (
            <div>
              <p>Nội dung khóa học đang cập nhật...</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="bg-white p-4 rounded shadow h-fit">
          <h2 className="text-lg font-bold mb-2">{course.name}</h2>

          <div className="text-gray-400 line-through">
            {formatPrice(course.price * 1.5)}
          </div>

          <div className="text-blue-600 text-2xl font-bold mb-4">
            {formatPrice(course.price)}
          </div>

          <button className="w-full border border-red-400 text-red-500 py-2 rounded mb-2">
            Nâng cấp gói hội viên
          </button>

          <button className="w-full bg-blue-500 text-white py-2 rounded mb-2">
            Thêm vào giỏ
          </button>

          <button className="w-full bg-green-500 text-white py-2 rounded">
            Thanh toán ngay
          </button>

          {/* INFO BOX */}
          <div className="mt-4 space-y-3 text-sm">
            <div className="bg-gray-100 p-2 rounded">📚 15 bài giảng</div>
            <div className="bg-gray-100 p-2 rounded">💻 Học online</div>
            <div className="bg-gray-100 p-2 rounded">⚡ Kích hoạt nhanh</div>
          </div>
        </div>
      </div>

      {/* SIDEBAR COURSE */}
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4 text-green-600">
          Khóa học mới
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {courses.slice(0, 5).map((c) => (
            <div key={c.id} className="bg-white p-2 rounded shadow">
              <img src={c.image} className="h-24 w-full object-cover rounded" />
              <p className="text-sm mt-2 line-clamp-2">{c.name}</p>
              <p className="text-blue-500 font-bold text-sm">
                {formatPrice(c.price)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}