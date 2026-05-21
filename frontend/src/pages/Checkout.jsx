import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCourseById } from "../api/courseApi";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { membershipPackages } from "../data/membershipPackages";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("courseId");
  const packageId = searchParams.get("package");
  const { user, addPurchasedCourse, addMembership, cartItems, clearCart } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [membershipPackage, setMembershipPackage] = useState(null);
  const [cartCourses, setCartCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");
  const [paymentState, setPaymentState] = useState("ready");

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }

    const fetchCourse = async () => {
      if (packageId) {
        const pkg = membershipPackages[packageId];
        setMembershipPackage(pkg || null);
        setLoading(false);
        return;
      }
      if (!courseId) {
        setCartCourses(cartItems || []);
        setLoading(false);
        return;
      }
      const data = await getCourseById(courseId);
      setCourse(data);
      setLoading(false);
    };

    fetchCourse();
  }, [user, courseId, packageId, location.pathname, location.search, navigate, cartItems]);

  const formatPrice = (price) =>
    price || price === 0 ? new Intl.NumberFormat("vi-VN").format(price) + "đ" : "Miễn phí";

  const packageItem = membershipPackage
    ? {
        id: `membership-${membershipPackage.id}`,
        name: `${membershipPackage.title} Membership`,
        price: membershipPackage.price,
        description: membershipPackage.description,
      }
    : null;

  const checkoutItems = packageItem
    ? [packageItem]
    : courseId
    ? course
      ? [course]
      : []
    : cartCourses;

  const basePrice = checkoutItems.reduce((sum, item) => sum + Number(item?.price || 0), 0);
  const discountValue = discountApplied ? Math.round(basePrice * 0.1) : 0;
  const totalPrice = Math.max(0, basePrice - discountValue);

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountMessage("Vui lòng nhập mã giảm giá.");
      return;
    }
    if (discountCode.trim().toUpperCase() === "KKH10") {
      setDiscountApplied(true);
      setDiscountMessage("Áp dụng mã thành công - giảm 10%.");
      return;
    }
    setDiscountApplied(false);
    setDiscountMessage("Mã giảm giá không hợp lệ.");
  };

  const buildMembershipPayload = (pkg) => {
    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setDate(expiresAt.getDate() + pkg.durationDays);

    return {
      packageId: pkg.id,
      title: pkg.title,
      price: pkg.price,
      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      durationDays: pkg.durationDays,
      totalCourses: pkg.totalCourses,
      dailyLimit: pkg.dailyLimit,
      bonusPremiumCourses: pkg.bonusPremiumCourses,
      extraCourses: pkg.extraCourses,
      allowCourseRange: pkg.allowCourseRange,
      avgPricePerCourse: pkg.avgPricePerCourse,
      description: pkg.description,
      rules: pkg.rules,
      usedCourses: 0,
      status: "active",
    };
  };

  const handlePayment = async () => {
    if (checkoutItems.length === 0) return;

    try {
      if (packageId && membershipPackage) {
        // Save membership to backend
        const membershipRes = await api.post("/user-membership/buy", {
          userId: user.userId,
          membershipId: membershipPackage.id,
        });
        if (!membershipRes.data) throw new Error("Lỗi mua gói thành viên");
        const membershipData = buildMembershipPayload(membershipPackage);
        addMembership(membershipData);
        navigate(`/order-success?package=${encodeURIComponent(packageId)}&amount=${encodeURIComponent(totalPrice)}`);
        return;
      }

      if (totalPrice === 0) {
        checkoutItems.forEach((item) => addPurchasedCourse(item.id));
        if (!courseId) clearCart();
        navigate(`/order-success?amount=0`);
        return;
      }
      setPaymentState("qr");
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Lỗi khi xử lý thanh toán, vui lòng thử lại");
    }
  };

  const confirmQrPayment = async () => {
    if (checkoutItems.length === 0) return;
    
    try {
      if (packageId && membershipPackage) {
        // Save membership to backend
        const membershipRes = await api.post("/user-membership/buy", {
          userId: user.userId,
          membershipId: membershipPackage.id,
        });
        if (!membershipRes.data) throw new Error("Lỗi mua gói thành viên");
        const membershipData = buildMembershipPayload(membershipPackage);
        addMembership(membershipData);
        navigate(`/order-success?package=${encodeURIComponent(packageId)}&amount=${encodeURIComponent(totalPrice)}`);
        return;
      }
      
      // Save course orders to backend
      const orderRes = await api.post("/orders", {
        userId: user.userId,
        totalPrice: totalPrice,
        status: "COMPLETED",
        paymentMethod: "QR",
        orderItems: checkoutItems.map((item) => ({
          courseId: item.id,
          price: item.price,
        })),
      });
      
      if (!orderRes.data) throw new Error("Lỗi tạo đơn hàng");
      
      checkoutItems.forEach((item) => addPurchasedCourse(item.id));
      if (!courseId) clearCart();
      navigate(`/order-success?amount=${encodeURIComponent(totalPrice)}`);
    } catch (error) {
      console.error("Lỗi thanh toán QR:", error);
      alert("Lỗi khi xử lý thanh toán, vui lòng thử lại");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto w-full px-4 py-10 flex-grow">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-5">Thanh toán</h1>

          {loading ? (
            <div className="text-gray-600">Đang tải thông tin đơn hàng...</div>
          ) : checkoutItems.length === 0 ? (
            <div className="text-gray-600">
              Giỏ hàng trống hoặc không có khóa học để thanh toán. Vui lòng thêm sản phẩm vào giỏ hàng.
            </div>
          ) : (
            <>
              <div className="rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Bạn có mã ưu đãi? <span className="text-orange-500 font-semibold">Ấn vào đây để nhập mã</span></p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <input
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      className="rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
                    >ÁP DỤNG</button>
                  </div>
                </div>
                {discountMessage && (
                  <p className={`mt-4 text-sm ${discountApplied ? "text-green-600" : "text-red-600"}`}>
                    {discountMessage}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-3xl border border-gray-200 p-6 bg-slate-50">
                    <h2 className="text-xl font-semibold mb-3">Thông tin đơn hàng</h2>
                    <div className="space-y-3 text-sm text-gray-700">
                      {checkoutItems.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-slate-600">{formatPrice(item.price)}</p>
                          <p className="text-slate-500 mt-2">{item.description || "Không có mô tả"}</p>
                          {packageId && membershipPackage && (
                            <ul className="mt-3 list-disc list-inside text-slate-500 text-sm">
                              {membershipPackage.rules.map((rule, index) => (
                                <li key={index}>{rule}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200 p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-3">Thông tin thanh toán</h2>
                    <div className="grid gap-4 text-sm text-gray-700">
                      <div>
                        <p className="font-medium text-slate-900">Tên</p>
                        <p>{user?.fullName || user?.username || "Khách"}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Email</p>
                        <p>{user?.email || user?.username || "Không xác định"}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Email lấy từ dữ liệu người dùng, không cần nhập lại.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-blue-500 p-6 bg-white shadow-sm">
                  <h2 className="text-xl font-semibold mb-5">Đơn hàng của bạn</h2>
                  <div className="text-sm text-gray-700 space-y-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">Sản phẩm</span>
                      <span className="font-semibold">Tạm tính</span>
                    </div>
                    {checkoutItems.map((item) => (
                      <div key={item.id} className="flex justify-between gap-4 text-gray-600">
                        <div className="max-w-[70%] break-words">{item.name} × 1</div>
                        <div>{formatPrice(item.price)}</div>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 pt-3 flex justify-between text-gray-600">
                      <span>Tạm tính</span>
                      <span>{formatPrice(basePrice)}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-green-700">
                        <span>Giảm 10%</span>
                        <span>-{formatPrice(discountValue)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-lg">
                      <span>Tổng</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
                    onClick={handlePayment}
                  >
                    Xác nhận thanh toán
                  </button>
                  {paymentState === "qr" && (
                    <div className="mt-6 rounded-3xl border border-dashed border-blue-300 bg-blue-50 p-6">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="text-lg font-semibold text-slate-900">Quét mã QR để thanh toán</div>
                        <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(`ThanhToan:${checkoutItems.map(item => item.name).join(',')}:${user?.email}:${totalPrice}`)}`}
                            alt="Mã QR thanh toán"
                            className="mx-auto h-64 w-64"
                          />
                        </div>
                        <p className="text-sm text-slate-600">Quét mã QR bằng ví Momo, ZaloPay, AirPay hoặc ngân hàng để hoàn tất thanh toán.</p>
                        <button
                          onClick={confirmQrPayment}
                          className="mt-2 rounded-3xl bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 transition"
                        >
                          Đã thanh toán, hoàn tất đơn hàng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
