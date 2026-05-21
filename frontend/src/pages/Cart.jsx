import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useContext(AuthContext);

  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />
      <main className="max-w-6xl mx-auto w-full px-4 py-10 flex-grow">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Giỏ hàng</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-xl font-semibold text-slate-800 mb-4">Giỏ hàng của bạn hiện đang trống.</p>
              <p className="text-sm text-slate-600 mb-6">Hãy thêm khóa học vào giỏ hàng để tiếp tục thanh toán.</p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-gray-200 bg-slate-50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "https://via.placeholder.com/120x80"}
                        alt={item.name}
                        className="h-20 w-28 rounded-2xl object-cover border border-gray-200"
                      />
                      <div>
                        <h2 className="font-semibold text-slate-900">{item.name}</h2>
                        <p className="text-sm text-slate-600 mt-1">Giá: {item.price ? new Intl.NumberFormat("vi-VN").format(item.price) + "đ" : "Miễn phí"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Tổng cộng giỏ hàng</h2>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat("vi-VN").format(totalPrice)}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4 flex justify-between text-lg font-bold text-slate-900">
                    <span>Tổng</span>
                    <span>{new Intl.NumberFormat("vi-VN").format(totalPrice)}đ</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="mt-6 w-full rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
