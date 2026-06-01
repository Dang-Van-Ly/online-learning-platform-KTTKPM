import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/axios";

const ChatAgent = () => {
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitMessage = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }

    const request = {
      message: message.trim(),
      orderId: orderId ? Number(orderId) : null,
    };

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/agent/message", request);
      const data = response.data;
      setHistory((prev) => [
        ...prev,
        { role: "user", text: request.message },
        { role: "assistant", text: data.assistantMessage || "Không có phản hồi." },
      ]);
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Lỗi khi gọi agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-slate-900">Trợ lý AI</h1>
          <p className="mt-2 text-sm text-slate-600">
            Gửi tin nhắn để nhận trợ giúp mua khóa học, giới thiệu khóa học phù hợp, hoặc hỗ trợ đặt hàng.
          </p>

          <form className="mt-6 space-y-4" onSubmit={submitMessage}>
            <div className="grid gap-4 md:grid-cols-[1fr_240px]">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Nội dung</span>
                <textarea
                  className="mt-2 min-h-[140px] w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Ví dụ: Giới thiệu cho tôi khóa học lập trình phù hợp, hoặc giúp tôi đặt mua khoá học Java"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Mã đơn hàng (tùy chọn)</span>
                <input
                  type="number"
                  className="mt-2 h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Nhập ID đơn hàng nếu cần"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Đang gửi..." : "Gửi yêu cầu"}
              </button>
              <span className="text-sm text-slate-500">
                Gợi ý: "Giới thiệu khóa học phù hợp" hoặc "Giúp tôi đặt đơn".
              </span>
            </div>
          </form>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-4">
            {history.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                Lịch sử chat sẽ xuất hiện ở đây.
              </div>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className={
                    item.role === "user"
                      ? "rounded-3xl bg-blue-50 p-5 text-slate-900"
                      : "rounded-3xl bg-slate-100 p-5 text-slate-900"
                  }
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.role === "user" ? "Bạn" : "Trợ lý"}
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6">{item.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatAgent;
