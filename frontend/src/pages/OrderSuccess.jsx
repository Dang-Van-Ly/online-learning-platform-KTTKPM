import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCourseById } from "../api/courseApi";
import { AuthContext } from "../context/AuthContext";
import { membershipPackages } from "../data/membershipPackages";

function getQueryParam(search, name) {
  return new URLSearchParams(search).get(name);
}

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);

  const courseId = getQueryParam(location.search, "courseId");
  const packageId = getQueryParam(location.search, "package");
  const amount = getQueryParam(location.search, "amount");

  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      const data = await getCourseById(courseId);
      setCourse(data);
    };
    fetchCourse();
  }, [courseId]);

  const packageInfo = packageId ? membershipPackages[packageId] : null;

  const formatPrice = (price) =>
    price || price === 0 ? new Intl.NumberFormat("vi-VN").format(Number(price)) + "đ" : "0đ";

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12 flex-grow">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-700">✓</div>
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-4">Thanh toán thành công</h1>
          <p className="text-center text-sm text-slate-600 mb-8">
            Đơn hàng đã được xử lý, khóa học đã được mở khóa và có thể truy cập ngay lập tức.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Người mua</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{user?.fullName || user?.email || "Người dùng"}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Tổng thanh toán</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{formatPrice(amount)}</p>
            </div>
          </div>

          {packageInfo ? (
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 mb-8">
              <p className="text-sm text-blue-700">Gói membership đã kích hoạt:</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">{packageInfo.title} Membership</h2>
              <p className="mt-2 text-sm text-slate-600">{packageInfo.description}</p>
              <div className="mt-4 grid gap-2 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>Thời hạn</span>
                  <span>{packageInfo.durationDays} ngày</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng khóa học</span>
                  <span>{packageInfo.totalCourses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giới hạn mỗi ngày</span>
                  <span>{packageInfo.dailyLimit} khóa</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus cao cấp</span>
                  <span>{packageInfo.bonusPremiumCourses || "Không"}</span>
                </div>
              </div>
            </div>
          ) : course ? (
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 mb-8">
              <p className="text-sm text-blue-700">Khóa học đã mở khóa:</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">{course.name}</h2>
              <p className="mt-2 text-sm text-slate-600">Bạn có thể truy cập toàn bộ bài giảng và tài nguyên của khóa học này.</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 mb-8">
              <p className="text-sm text-slate-500">Không có thông tin khóa học cụ thể hoặc khóa học đã được mở khóa bằng mã đơn hàng.</p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate(packageInfo ? "/membership" : courseId ? `/course/${courseId}` : "/")}
              className="rounded-3xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
            >
              {packageInfo ? "Đi đến Membership" : "Đi đến khóa học"}
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="rounded-3xl border border-slate-300 bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-100 transition"
            >
              Xem khóa học đã mua
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
