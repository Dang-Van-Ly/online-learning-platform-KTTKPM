import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const plansPremium = [
  { label: "Thời hạn", premium: "90 ngày (3 tháng)", gold: "365 ngày (1 năm)", diamond: "365 ngày (1 năm)" },
  { label: "Khóa/ngày", premium: "2 khóa mỗi ngày", gold: "3 khóa mỗi ngày", diamond: "3 khóa mỗi ngày" },
  { label: "Tổng khóa học", premium: "180 khóa (trong 90 ngày)", gold: "1,095 khóa (trong 1 năm)", diamond: "1,095 khóa (trong 1 năm)" },
  { label: "Loại khóa học", premium: "39.000đ-149.000đ + 1đ, 2đ", gold: "39.000đ-149.000đ + 1đ, 2đ", diamond: "39.000đ-149.000đ + 1đ, 2đ" },
  { label: "Khóa 199.000đ/3đ", premium: "+3 khóa (597.000đ)", gold: "+5 khóa (995.000đ)", diamond: "+36 khóa (7.164.000đ)" },
  { label: "Khóa tự chọn", premium: "Không có khóa tự chọn", gold: "+2 khóa lẻ giá bất kì", diamond: "+4 khóa lẻ giá bất kì" },
  { label: "Giá trị BONUS", premium: "597.000đ tổng giá trị", gold: "1.796.000đ tổng giá trị", diamond: "6.947.000đ tổng giá trị" },
  { label: "Chi phí/khóa", premium: "4.000đ mỗi khóa học", gold: "1.100đ mỗi khóa học", diamond: "900đ mỗi khóa học" },
  { label: "Phù hợp cho", premium: "Dùng thử 3 tháng", gold: "Học cả năm, giá hợp lý", diamond: "VIP, cần nhiều khóa cao cấp" },
];

const plansBasic = [
  { label: "Thời hạn", basic: "10 ngày", standard: "30 ngày", silver: "90 ngày" },
  { label: "Khóa/ngày", basic: "10 khóa (trong 10 ngày)", standard: "1 khóa mỗi ngày", silver: "2 khóa mỗi ngày" },
  { label: "Tổng khóa học", basic: "10 khóa (trong 10 ngày)", standard: "30 khóa (trong 30 ngày)", silver: "180 khóa (trong 90 ngày)" },
  { label: "Loại khóa học", basic: "39.000đ-149.000đ + 1đ, 2đ", standard: "39.000đ-149.000đ + 1đ, 2đ", silver: "39.000đ-149.000đ + 1đ, 2đ" },
  { label: "Bonus cao cấp", basic: "Không", standard: "Không", silver: "Không" },
  { label: "Chi phí/khóa", basic: "20.000đ mỗi khóa học", standard: "10.000đ mỗi khóa học", silver: "8.000đ mỗi khóa học" },
  { label: "Phù hợp cho", basic: "Trải nghiệm ngắn hạn", standard: "Học đều 1 tháng", silver: "Học nhiều 3 tháng" },
];

const Membership = () => {
  const navigate = useNavigate();

  const goToCheckout = (packageId) => {
    navigate(`/checkout?package=${packageId}`);
  };

  return (
    <div className="min-h-screen bg-[#f4f5fb] font-sans text-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-[32px] border border-[#f1f3fb] p-8 shadow-sm mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">CÁC GÓI HỘI VIÊN MEMBERSHIP</h1>
          <p className="text-center text-slate-600 max-w-3xl mx-auto">
            Chọn gói membership phù hợp với nhu cầu của bạn và bắt đầu học ngay hôm nay!
          </p>
        </div>

        <section className="bg-[#fff4f8] rounded-[32px] border border-[#ffd6e6] p-8 shadow-sm mb-10">
          <div className="text-center mb-6">
            <p className="uppercase text-sm font-bold tracking-[0.24em] text-[#c92c6d] mb-3">GÓI CAO CẤP – KHUYẾN NGHỊ</p>
            <h2 className="text-2xl sm:text-3xl font-bold">Sẵn sàng hành trình bắt đầu học tập</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Chọn gói phù hợp với nhu cầu và ngân sách của bạn. Tất cả gói đều có khóa học bonus cao cấp.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[24px] border border-[#f8d5e7] bg-white shadow-sm">
            <table className="min-w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#6d5ce7] text-white">
                  <th className="p-4 text-sm font-semibold">TIÊU CHÍ</th>
                  <th className="p-4 text-sm font-semibold">PREMIUM 699.000Đ</th>
                  <th className="p-4 text-sm font-semibold">GOLD 999.000Đ</th>
                  <th className="p-4 text-sm font-semibold">DIAMOND 1.499.000Đ</th>
                </tr>
              </thead>
              <tbody>
                {plansPremium.map((row) => (
                  <tr key={row.label} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-700">{row.label}</td>
                    <td className="p-4 text-slate-600">{row.premium}</td>
                    <td className="p-4 text-slate-600">{row.gold}</td>
                    <td className="p-4 text-slate-600">{row.diamond}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mt-8">
            <button onClick={() => goToCheckout('premium')} className="rounded-3xl bg-[#7f5cff] px-6 py-4 text-white font-semibold hover:bg-[#6547d8] transition">🚀 Đăng ký Premium</button>
            <button onClick={() => goToCheckout('gold')} className="rounded-3xl bg-[#ffb703] px-6 py-4 text-slate-900 font-semibold hover:bg-[#e69a00] transition">⭐ Đăng ký Gold</button>
            <button onClick={() => goToCheckout('diamond')} className="rounded-3xl bg-[#00a4d4] px-6 py-4 text-white font-semibold hover:bg-[#0086b8] transition">💎 Đăng ký Diamond</button>
          </div>
        </section>

        <section className="bg-white rounded-[32px] border border-[#e0e7ff] p-8 shadow-sm mb-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">GÓI CƠ BẢN – HỌC THỬ</h2>
            <p className="mt-3 text-slate-600 max-w-3xl mx-auto">
              Các gói cơ bản phù hợp cho người mới bắt đầu hoặc muốn trải nghiệm ngắn hạn.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[24px] border border-[#cbd5e1] bg-slate-50 shadow-sm">
            <table className="min-w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-4 text-sm font-semibold">TIÊU CHÍ</th>
                  <th className="p-4 text-sm font-semibold">BASIC 199.000Đ</th>
                  <th className="p-4 text-sm font-semibold">STANDARD 299.000Đ</th>
                  <th className="p-4 text-sm font-semibold">SILVER 499.000Đ</th>
                </tr>
              </thead>
              <tbody>
                {plansBasic.map((row) => (
                  <tr key={row.label} className="border-t border-slate-200 hover:bg-white">
                    <td className="p-4 font-medium text-slate-700">{row.label}</td>
                    <td className="p-4 text-slate-600">{row.basic}</td>
                    <td className="p-4 text-slate-600">{row.standard}</td>
                    <td className="p-4 text-slate-600">{row.silver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mt-8">
            <button onClick={() => goToCheckout('basic')} className="rounded-3xl bg-slate-600 px-6 py-4 text-white font-semibold hover:bg-slate-700 transition">Đăng ký Basic</button>
            <button onClick={() => goToCheckout('standard')} className="rounded-3xl bg-[#2563eb] px-6 py-4 text-white font-semibold hover:bg-[#1d4ed8] transition">Đăng ký Standard</button>
            <button onClick={() => goToCheckout('silver')} className="rounded-3xl bg-slate-500 px-6 py-4 text-white font-semibold hover:bg-slate-600 transition">Đăng ký Silver</button>
          </div>
        </section>

        <section className="rounded-[32px] border border-[#dde3f2] bg-[#f8fbff] p-8 shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold">Sẵn sàng bắt đầu hành trình học tập?</h3>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
              Chọn gói membership phù hợp với nhu cầu của bạn và bắt đầu học ngay hôm nay!
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <button className="rounded-3xl bg-white border border-slate-300 px-6 py-4 text-slate-900 font-semibold hover:bg-slate-100 transition">Xem tất cả gói</button>
            <button className="rounded-3xl bg-[#4f46e5] text-white px-6 py-4 font-semibold hover:bg-[#3730a3] transition">Liên hệ tư vấn</button>
            <button className="rounded-3xl bg-[#0f766e] text-white px-6 py-4 font-semibold hover:bg-[#115e59] transition">Nhận ưu đãi</button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Membership;
