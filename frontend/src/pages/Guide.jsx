import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Guide() {
    return (
        <div className="font-sans min-h-screen bg-[#f5f7fb] text-[#222]">
            <Header />
            <main className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Hướng dẫn nhận khóa học</h1>
                    <p className="text-slate-600 text-lg">Thực hiện đúng 4 bước sau để mua khóa học, chuyển khoản và nhận quyền truy cập nhanh chóng.</p>
                </div>

                <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
                            <div className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 mb-4">B1</div>
                            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Tìm khóa học cần mua và chọn Thanh toán ngay</h2>
                            <p className="text-slate-600 leading-7">Trên trang khóa học, chọn khóa bạn muốn và bấm nút <span className="font-semibold text-orange-600">Thanh toán ngay</span> để vào giỏ hàng và tiếp tục thao tác.</p>
                        </section>

                        <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
                            <div className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 mb-4">B2</div>
                            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Điền đầy đủ thông tin vào ô</h2>
                            <ul className="space-y-3 text-slate-600 pl-4 list-disc">
                                <li>Tên của bạn</li>
                                <li>Email đăng nhập</li>
                                <li>Mật khẩu đăng nhập</li>
                                <li>Chọn phương thức chuyển khoản</li>
                                <li>Đặt hàng</li>
                            </ul>
                            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Thanh toán</h3>
                                <div className="space-y-3">
                                    <div className="rounded-2xl bg-white p-4 border border-slate-200">
                                        <p className="text-sm text-slate-500">Tên</p>
                                        <p className="mt-2 font-semibold text-slate-900">Vân lý</p>
                                    </div>
                                    <div className="rounded-2xl bg-white p-4 border border-slate-200">
                                        <p className="text-sm text-slate-500">Email</p>
                                        <p className="mt-2 font-semibold text-slate-900">admin@example.com</p>
                                    </div>
                                    <div className="rounded-2xl bg-white p-4 border border-slate-200">
                                        <p className="text-sm text-slate-500">Mật khẩu</p>
                                        <p className="mt-2 text-slate-600">********</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
                            <div className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 mb-4">B3</div>
                            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Kiểm tra lại đơn hàng và chuyển khoản</h2>
                            <p className="text-slate-600 leading-7">Kiểm tra kỹ thông tin đơn hàng. Nội dung chuyển khoản phải ghi chính xác <span className="font-semibold text-slate-900">mã đơn hàng</span> để hệ thống kích hoạt nhanh.</p>
                        </section>

                        <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
                            <div className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 mb-4">B4</div>
                            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Nhận khóa học</h2>
                            <p className="text-slate-600 leading-7">Sau khi chuyển khoản xong, vào <span className="font-semibold text-slate-900">Tài khoản</span> và chọn mục <span className="font-semibold text-slate-900">Đơn hàng</span> để nhận khóa học.</p>
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                            <h3 className="text-xl font-semibold text-slate-900 mb-4">Đơn hàng của bạn</h3>
                            <div className="space-y-3 text-sm text-slate-600">
                                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                                    <p className="font-semibold text-slate-900">Cảm ơn bạn. Đơn hàng của bạn đã được nhận.</p>
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Mã đơn hàng</span>
                                        <span className="font-semibold text-slate-900">2899</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Ngày</span>
                                        <span className="font-semibold text-slate-900">08/05/2022</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Email</span>
                                        <span className="font-semibold text-slate-900">khokhoahoc@gmail.com</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Tổng cộng</span>
                                        <span className="font-semibold text-slate-900">99.000đ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Phương thức thanh toán</span>
                                        <span className="font-semibold text-slate-900">Chuyển khoản ngân hàng</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 text-orange-900">
                            <p className="font-semibold mb-3">Chú ý</p>
                            <p>Nếu trong vòng 3-5 phút đơn hàng chưa được kích hoạt, hãy liên hệ admin qua Zalo <span className="font-semibold">0949059280</span>.</p>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}
