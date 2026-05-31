import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function CourseExchange() {
  const navigate = useNavigate();

  return (
    <div className="font-sans min-h-screen bg-[#f5f7fb] text-[#222]">
      <Header />
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Trao đổi khóa học</h1>
            <p className="text-slate-600 text-lg leading-8">
              Nếu bạn muốn trao đổi hoặc đổi khóa học, vui lòng làm theo các bước bên dưới để được hỗ trợ nhanh nhất.
            </p>
          </div>

          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 mb-4">
                Bước 1
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">Kết bạn với Zalo</h2>
              <p className="text-slate-600 leading-7">
                Vui lòng kết bạn với số Zalo <span className="font-semibold text-slate-900">0949059280</span> để bắt đầu yêu cầu trao đổi khóa học.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 mb-4">
                Bước 2
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">Gửi tin nhắn theo mẫu</h2>
              <div className="space-y-3 text-slate-600 leading-7">
                <p>Xin chào admin, tôi muốn trao đổi khóa học với nội dung như sau:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Link khóa học hiện có: <span className="font-semibold text-slate-900">[dán link khóa học của bạn]</span></li>
                  <li>Link khóa học muốn đổi: <span className="font-semibold text-slate-900">[dán link khóa học bạn muốn đổi]</span></li>
                </ul>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">Ghi chú quan trọng</h2>
              <p className="text-slate-600 leading-7">
                Sau khi admin nhận được yêu cầu trao đổi khóa học, họ sẽ liên hệ lại và hướng dẫn bạn hoàn tất trong thời gian sớm nhất.
              </p>
              <div className="mt-6 rounded-3xl border border-orange-200 bg-orange-50 p-6 text-orange-900">
                <p className="font-semibold mb-2">Lưu ý</p>
                <p>Hãy đảm bảo gửi đúng link khóa học và nội dung trao đổi để tránh chậm trễ xử lý.</p>
              </div>
            </section>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Quay lại trang khóa học
            </button>
            <button
              onClick={() => navigate('/membership')}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Xem gói hội viên
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
