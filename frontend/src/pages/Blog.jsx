import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    Calendar, Clock, User, ChevronRight,
    Home as HomeIcon, ArrowLeft, Share2, MessageCircle
} from 'lucide-react';

// --- DATA NỘI DUNG CHI TIẾT CỦA CÁC BÀI VIẾT ---
const BLOG_DATA = [
    {
        id: 1,
        title: "Lộ trình 30 ngày làm chủ AI cho người làm văn phòng",
        category: "AI - Công Nghệ",
        date: "25/05/2026",
        readTime: "15 phút",
        author: "Admin Tech",
        image: "https://picsum.photos/800/400?random=101",
        summary: "AI không thay thế con người, nhưng người biết dùng AI sẽ thay thế người không biết...",
        content: (
            <div className="space-y-4">
                <p className="font-semibold text-lg text-gray-700">Tại sao bạn phải học AI ngay bây giờ?</p>
                <p>Trong môi trường công sở hiện đại, Generative AI (AI tạo sinh) như ChatGPT hay Claude không chỉ là công cụ chat. Nó là một trợ lý đa năng có thể soạn thảo email, phân tích số liệu từ file Excel hàng ngàn dòng chỉ trong 30 giây.</p>
                <h4 className="text-xl font-bold text-blue-600">Giai đoạn 1: Làm quen với câu lệnh (Prompt)</h4>
                <p>Đừng chỉ hỏi "Viết cho tôi cái này". Hãy học cấu trúc <strong>Role - Context - Task - Constraint</strong>. Ví dụ: "Bạn là một chuyên gia marketing (Role), tôi đang chuẩn bị ra mắt khóa học nấu ăn (Context), hãy viết 3 tiêu đề quảng cáo (Task), độ dài mỗi tiêu đề dưới 10 chữ (Constraint)."</p>
                <h4 className="text-xl font-bold text-blue-600">Giai đoạn 2: Tự động hóa với quy trình AI</h4>
                <p>Sử dụng các công cụ như Canva Magic Design để tạo slide bài thuyết trình từ văn bản. Điều này giúp bạn tiết kiệm ít nhất 3-4 tiếng làm việc mỗi ngày.</p>
                <div className="bg-blue-50 p-4 border-l-4 border-blue-500 italic">
                    "AI sẽ không cướp đi công việc của bạn, nhưng người biết điều khiển AI thì có."
                </div>
            </div>
        )
    },
    {
        id: 2,
        title: "Bí kíp xây dựng kênh TikTok triệu view từ con số 0",
        category: "Tiktok - Video",
        date: "20/05/2026",
        readTime: "10 phút",
        author: "Lê Minh Editor",
        image: "https://picsum.photos/800/400?random=102",
        summary: "Khám phá quy tắc 3 giây đầu tiên và cách kể chuyện bằng hình ảnh để giữ chân người xem...",
        content: (
            <div className="space-y-4">
                <p>Thuật toán TikTok năm 2026 tập trung cực mạnh vào <strong>Retention Rate</strong> (Tỷ lệ giữ chân người xem). Nếu 3 giây đầu bạn không gây ấn tượng, clip của bạn sẽ bị lướt qua ngay lập tức.</p>
                <h4 className="text-xl font-bold text-orange-600">Quy tắc "Cái tát thị giác"</h4>
                <p>Hãy bắt đầu video bằng một hành động bất ngờ hoặc một câu hỏi đánh trúng nỗi đau của khán giả. Đừng bắt đầu bằng "Chào mọi người, mình là...".</p>
                <h4 className="text-xl font-bold text-orange-600">Kỹ thuật Edit Video trên Capcut</h4>
                <p>Cứ mỗi 1.5 - 2 giây, bạn nên có một sự thay đổi khung hình (Zoom in, Zoom out hoặc chèn chữ). Điều này kích thích não bộ người xem liên tục và làm họ khó rời mắt khỏi màn hình.</p>
            </div>
        )
    },
    {
        id: 3,
        title: "Affiliate Marketing: Cách kiếm 10-20 triệu/tháng bền vững",
        category: "Kiếm Tiền Online",
        date: "15/05/2026",
        readTime: "12 phút",
        author: "Văn Ly Marketing",
        image: "https://picsum.photos/800/400?random=103",
        summary: "Đừng rải link spam nữa! Hãy học cách xây dựng tệp khán giả trung thành thông qua blog và cá nhân hóa...",
        content: (
            <div className="space-y-4">
                <p>Sai lầm lớn nhất của người mới làm Affiliate là đi spam link vào các hội nhóm. Điều này chỉ khiến bạn bị block. Cách làm bền vững là <strong>Trao giá trị trước - Bán hàng sau</strong>.</p>
                <h4 className="text-xl font-bold text-green-600">Xây dựng hệ thống "Review thật"</h4>
                <p>Thay vì copy ảnh mạng, hãy tự mua sản phẩm về dùng và chia sẻ cảm nhận thật. Khách hàng năm 2026 rất thông minh, họ chỉ mua từ người mà họ tin tưởng.</p>
                <p>Các ngách tiềm năng: Sản phẩm số (Khóa học, phần mềm), Đồ gia dụng thông minh, và các sản phẩm chăm sóc sức khỏe xanh.</p>
            </div>
        )
    }
];

export default function Blog() {
    const navigate = useNavigate();
    const [selectedPost, setSelectedPost] = useState(null); // Trạng thái xem chi tiết

    // Hàm cuộn lên đầu trang
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Khi click đọc bài
    const handleReadMore = (post) => {
        setSelectedPost(post);
        scrollToTop();
    };

    // Khi click quay lại danh sách blog
    const handleBackToList = () => {
        setSelectedPost(null);
        scrollToTop();
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-left">
            <Header />

            {/* --- BREADCRUMBS & NAVIGATION --- */}
            <nav className="bg-white border-b border-gray-200 py-3 px-4">
                <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span
              className="flex items-center gap-1 hover:text-blue-600 cursor-pointer transition-colors"
              onClick={() => navigate('/')}
          >
            <HomeIcon size={16} /> Trang chủ
          </span>
                    <ChevronRight size={14} />
                    <span
                        className={`cursor-pointer transition-colors ${!selectedPost ? "text-blue-600 font-bold" : "hover:text-blue-600"}`}
                        onClick={handleBackToList}
                    >
            Blog kiến thức
          </span>
                    {selectedPost && (
                        <>
                            <ChevronRight size={14} />
                            <span className="text-gray-800 font-bold truncate max-w-[200px] md:max-w-none">{selectedPost.title}</span>
                        </>
                    )}
                </div>
            </nav>

            <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-grow">

                {!selectedPost ? (
                    /* ================= GIAO DIỆN DANH SÁCH BLOG ================= */
                    <div className="animate-in fade-in duration-500">
                        <div className="mb-10">
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase">KHO KIẾN THỨC <span className="text-blue-600">FREE</span></h1>
                            <p className="text-gray-500 max-w-2xl">Tổng hợp các bài viết chuyên sâu về công nghệ, kỹ năng kiếm tiền và mẹo tối ưu công việc từ các giảng viên hàng đầu.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {BLOG_DATA.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer"
                                    onClick={() => handleReadMore(post)}
                                >
                                    <div className="relative h-52 overflow-hidden">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                                            {post.category}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-500 text-sm mb-6 line-clamp-2 italic">"{post.summary}"</p>
                                        <div className="mt-auto flex items-center justify-between text-[12px] text-gray-400 font-medium">
                                            <span className="flex items-center gap-1"><User size={14}/> {post.author}</span>
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* ================= GIAO DIỆN CHI TIẾT BÀI VIẾT ================= */
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={handleBackToList}
                            className="mb-6 flex items-center gap-2 text-blue-600 font-bold hover:underline"
                        >
                            <ArrowLeft size={18} /> Quay lại danh sách
                        </button>

                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            {/* Cover Image */}
                            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-[300px] md:h-[450px] object-cover" />

                            <div className="p-6 md:p-12">
                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6 font-medium">
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold uppercase text-[11px]">{selectedPost.category}</span>
                                    <span className="flex items-center gap-1"><Calendar size={16}/> {selectedPost.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={16}/> {selectedPost.readTime} đọc</span>
                                    <span className="flex items-center gap-1 text-gray-600"><User size={16}/> Đăng bởi: {selectedPost.author}</span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                                    {selectedPost.title}
                                </h1>

                                {/* Main Content Render */}
                                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed text-lg pb-10 border-b border-gray-100">
                                    {selectedPost.content}
                                </div>

                                {/* Footer Bài Viết */}
                                <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all">
                                            <Share2 size={18} /> Chia sẻ ngay
                                        </button>
                                        <button className="flex items-center gap-2 border border-gray-200 px-5 py-2.5 rounded-full font-bold hover:bg-gray-50 transition-all">
                                            <MessageCircle size={18} /> Thảo luận
                                        </button>
                                    </div>
                                    <div className="text-gray-400 text-sm italic">Cảm ơn bạn đã theo dõi bài viết này!</div>
                                </div>
                            </div>
                        </div>

                        {/* Bài viết liên quan (Gợi ý nhanh) */}
                        <div className="mt-16 text-left">
                            <h3 className="text-2xl font-bold mb-8">Có thể bạn quan tâm</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {BLOG_DATA.filter(p => p.id !== selectedPost.id).slice(0, 2).map(p => (
                                    <div
                                        key={p.id}
                                        className="bg-white p-4 rounded-2xl flex gap-4 border border-gray-100 hover:border-blue-400 cursor-pointer transition-all shadow-sm"
                                        onClick={() => handleReadMore(p)}
                                    >
                                        <img src={p.image} className="w-24 h-24 rounded-xl object-cover" />
                                        <div>
                                            <h4 className="font-bold text-gray-800 line-clamp-2 mb-2">{p.title}</h4>
                                            <span className="text-xs text-blue-500 font-bold uppercase">{p.category}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}