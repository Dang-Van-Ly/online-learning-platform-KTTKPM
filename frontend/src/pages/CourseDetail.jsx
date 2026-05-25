import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCourseById, getAllCourses, getChaptersByCourse, getFilesByLesson } from "../api/courseApi";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart, PlayCircle, Star, MessageCircle, Lock, ChevronDown, ChevronUp } from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourses, setNewCourses] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("desc");
  const [lessonFiles, setLessonFiles] = useState({});
  const { user, purchasedCourseIds, cartItems, addToCart, membershipInfo, addPurchasedCourse, useMembershipCourse } = useContext(AuthContext);

  const handleCheckout = () => {
    const checkoutUrl = `/checkout?courseId=${encodeURIComponent(id)}`;
    if (!user) {
      alert("Vui lòng đăng nhập trước khi thanh toán.");
      navigate(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }
    navigate(checkoutUrl);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCourseById(id);
        if (!isMounted) return;

        setCourse(data);
        if (data) {
          const chaps = await getChaptersByCourse(id);
          if (!isMounted) return;

          setChapters(chaps || []);
          if (chaps && chaps.length > 0) {
            const promises = [];
            chaps.forEach(chapter => {
              if (chapter.lessons) {
                chapter.lessons.forEach(lesson => {
                  promises.push(getFilesByLesson(lesson.id).then(files => ({ lessonId: lesson.id, files })));
                });
              }
            });
            const results = await Promise.all(promises);
            if (!isMounted) return;

            const filesMap = {};
            results.forEach(r => {
              filesMap[r.lessonId] = r.files;
            });
            setLessonFiles(filesMap);
          }
        }

        const all = await getAllCourses();
        if (!isMounted) return;

        const others = all.filter(c => String(c.id) !== String(id));
        setNewCourses(others.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 6));
        setRelatedCourses(others.sort(() => Math.random() - 0.5).slice(0, 8));
      } catch (error) {
        console.error("Error loading course data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatPrice = (price) =>
    price ? new Intl.NumberFormat("vi-VN").format(price) + "đ" : "Miễn phí";

  const originalPrice = (price) =>
    price ? new Intl.NumberFormat("vi-VN").format(Math.round(price * 2.5)) + "đ" : "";

  if (loading) return (
    <><Header /><div className="flex justify-center items-center min-h-[400px] text-gray-500 text-lg">Đang tải dữ liệu...</div><Footer /></>
  );

  if (!course) return (
    <><Header /><div className="flex flex-col justify-center items-center min-h-[400px] gap-4"><h2 className="text-xl font-bold">Không tìm thấy khóa học</h2><button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded">Quay về trang chủ</button></div><Footer /></>
  );

  const isFree = ((course?.type || "").toLowerCase() === "free") || Number(course?.price) === 0;
  const hasPurchased = Boolean(
    course?.isPurchased ||
    course?.hasPurchased ||
    course?.bought ||
    course?.purchased ||
    purchasedCourseIds.includes(String(id))
  );
  const isPaidCourse = course && !isFree;
  const courseLocked = isPaidCourse && !hasPurchased;
  const isInCart = cartItems.some(item => String(item.id) === String(id));

  const handleAddToCart = () => {
    if (!course) return;
    addToCart({ id, name: course.name, price: course.price || 0, image: course.image || "" });
    alert("Đã thêm vào giỏ hàng");
  };
  const allLessons = (chapters || []).flatMap(ch => ch.lessons || []);
  const lessonCount = allLessons.length;

  const today = new Date().toISOString().split("T")[0];
  const membershipLastUsedDay = membershipInfo?.lastUsedDate ? membershipInfo.lastUsedDate.split("T")[0] : null;
  const membershipUsedToday = membershipLastUsedDay === today ? Number(membershipInfo?.usedToday || 0) : 0;
  const membershipRemainingDaily = Math.max(0, (membershipInfo?.dailyLimit || 0) - membershipUsedToday);
  const membershipRemainingTotal = Math.max(0, (membershipInfo?.totalCourses || 0) - (membershipInfo?.usedCourses || 0));
  const membershipActive = Boolean(
    membershipInfo &&
    membershipInfo.status === "active" &&
    new Date(membershipInfo.expiresAt) > new Date() &&
    membershipRemainingDaily > 0 &&
    membershipRemainingTotal > 0
  );
  const membershipAvailableForThisCourse = membershipActive && courseLocked;

  const handleUnlockWithMembership = async () => {
    if (!membershipAvailableForThisCourse) {
      alert("Không thể mở khóa theo membership. Vui lòng kiểm tra lại số lượt hoặc trạng thái gói.");
      return;
    }
    try {
      // Gọi API enroll để backend ghi nhận và kiểm tra giới hạn membership
      await api.post("/enrollments", {
        userId: user.userId,
        courseId: Number(id),
        pricePaid: course?.price || 0,
      });
      // Cập nhật local state: trừ lượt membership + thêm vào danh sách đã mua
      useMembershipCourse(id);
      addPurchasedCourse(id);
      alert(`Đã mở khóa khóa học bằng gói membership. Còn ${membershipRemainingDaily - 1} lượt hôm nay và ${membershipRemainingTotal - 1} lượt tổng.`);
      setActiveTab("learn");
    } catch (error) {
      const msg = error?.response?.data || error?.message || "Lỗi không xác định";
      alert("Không thể mở khóa: " + msg);
    }
  };

  // Build lesson list from real API data
  const lessonList = allLessons.map((l, i) => ({
    title: l?.title || `Bai ${i + 1}`,
    isFree: l?.isFree || i === 0
  }));

  const targetAudience = [
    { bold: "Người mới bắt đầu:", text: " Chưa có kiến thức nền tảng, muốn học từ đầu một cách bài bản và hệ thống." },
    { bold: "Người đi làm:", text: " Muốn nâng cao kỹ năng chuyên môn để thăng tiến trong sự nghiệp và tăng thu nhập." },
    { bold: "Sinh viên & Học sinh:", text: " Muốn trang bị thêm kỹ năng thực tế bên cạnh kiến thức học đường." },
    { bold: "Chủ doanh nghiệp/Start-up:", text: " Cần kiến thức thực chiến để áp dụng ngay vào công việc kinh doanh." },
    { bold: "Người hướng nội/Thiếu tự tin:", text: " Muốn cải thiện bản thân và tự tin hơn trong công việc và cuộc sống." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      {/* DEAL BANNER */}
      <div className="bg-red-600 text-white text-center py-2 text-sm font-semibold flex items-center justify-center gap-4">
        <span>🔥 DEAL GIÁ HỜI HÔM NAY - GIẢM CỰC SÂU</span>
        <span className="bg-white text-red-600 px-3 py-0.5 rounded font-bold text-xs">Chỉ còn: 2 Ngày 23:53:23</span>
        <button className="bg-yellow-400 text-red-700 font-bold px-4 py-1 rounded text-xs hover:bg-yellow-300">NHẬN DEAL NGAY</button>
      </div>

      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-grow">

        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">

          {/* LEFT: Thumbnail */}
          <div className="lg:w-[38%]">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={course.imageUrl || course.image || "https://via.placeholder.com/800x450"}
                alt={course.name}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded shadow text-sm">
                <MessageCircle size={16} /> Trao đổi KH
              </button>
              <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded shadow text-sm">
                <PlayCircle size={16} /> Học Thử
              </button>
            </div>
          </div>

          {/* CENTER: Info */}
          <div className="lg:w-[35%] flex flex-col">
            <h1 className="text-xl font-bold text-gray-800 mb-3 leading-snug">{course.name}</h1>

            <div className="flex items-baseline gap-3 mb-3">
              {isFree ? (
                <span className="text-3xl font-black text-green-600">Miễn phí</span>
              ) : (
                <>
                  <span className="text-gray-400 line-through text-base">{originalPrice(course.price)}</span>
                  <span className="text-3xl font-black text-red-500">{formatPrice(course.price)}</span>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-28 shrink-0">Thời lượng</span>
                <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded font-semibold flex-1 text-center">{lessonCount} Bài Giảng</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 w-28 shrink-0">Mã giảm giá</span>
                <span className="bg-red-500 text-white px-4 py-1 rounded font-bold flex-1 text-center tracking-widest">KKH10</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <button className="flex justify-center items-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold py-2.5 rounded text-sm transition">
                👤 Nâng Cấp Gói Hội Viên Ngay
              </button>
              <button className="flex justify-center items-center gap-2 border-2 border-gray-700 text-gray-700 hover:bg-gray-50 font-bold py-2.5 rounded text-sm transition">
                <Star size={16} /> Nhóm Cộng Đồng Kho Khóa Học
              </button>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  onClick={isInCart ? () => navigate('/gio-hang') : handleAddToCart}
                  className="flex justify-center items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-bold py-2.5 rounded shadow text-sm"
                >
                  <ShoppingCart size={16} /> {isInCart ? "Đến giỏ hàng" : "Thêm vào giỏ"}
                </button>
                {courseLocked ? (
                  <div className="grid gap-3">
                    {membershipAvailableForThisCourse ? (
                      <button onClick={handleUnlockWithMembership} className="flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded shadow text-sm">
                        🔓 Mở khóa theo membership ({membershipRemainingDaily} lượt hôm nay / {membershipRemainingTotal} tổng)
                      </button>
                    ) : membershipInfo && membershipInfo.status === "active" ? (
                      <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                        Gói membership: Còn {membershipRemainingTotal} lượt tổng, {membershipRemainingDaily} lượt hôm nay
                        {membershipRemainingTotal === 0 && " (đã hết lượt)"}
                        {membershipRemainingDaily === 0 && " (hết lượt hôm nay)"}
                      </div>
                    ) : null}
                    <button onClick={handleCheckout} className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded shadow text-sm">
                      💳 Thanh toán ngay
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setActiveTab("learn")} className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded shadow text-sm">
                    ▶️ Tiếp tục học
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Features */}
          <div className="lg:w-[27%] flex flex-col gap-3">
            <FeatureCard
              icon="🎬"
              iconBg="bg-red-100"
              title="Đầy Đủ Bài Giảng"
              desc="Cam kết video bài giảng và tài liệu giống mô tả"
              highlight
            />
            <FeatureCard
              icon="📱"
              iconBg="bg-blue-100"
              title="Học Online Tiện Lợi"
              desc="Học online trên Website bằng điện thoại hoặc máy tính"
            />
            <FeatureCard
              icon="⚡"
              iconBg="bg-yellow-100"
              title="Kích Hoạt Nhanh"
              desc="Nhận khóa học trong vòng 3-5 giây"
            />
          </div>
        </div>

        {/* TABS + SIDEBAR */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* MAIN CONTENT */}
          <div className="lg:w-[70%]">
            {/* Tab buttons */}
            <div className="flex border-b border-gray-300 mb-0 bg-white rounded-t-lg overflow-hidden">
              <button
                onClick={() => setActiveTab("desc")}
                className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === "desc" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-blue-500 bg-gray-50"}`}
              >
                Mô tả
              </button>
              <button
                onClick={() => setActiveTab("learn")}
                className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === "learn" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-500 hover:text-blue-500 bg-gray-50"}`}
              >
                Vào học
              </button>
            </div>

            <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 shadow-sm">
              {activeTab === "desc" ? (
                <DescTab course={course} targetAudience={targetAudience} lessonList={lessonList} isFree={isFree} formatPrice={formatPrice} />
              ) : (
                <LearnTab chapters={chapters} lessonFiles={lessonFiles} course={course} hasPurchased={hasPurchased} />
              )}
            </div>

            {/* Related courses */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Sản phẩm tương tự</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedCourses.map(c => (
                  <div key={c.id} onClick={() => navigate(`/course/${c.id}`)} className="cursor-pointer group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <img src={c.image} alt={c.name} className="w-full h-28 object-cover group-hover:opacity-90 transition-opacity" />
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-700 line-clamp-2 mb-1 leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-400 line-through">{originalPrice(c.price)}</p>
                      <p className="text-sm font-bold text-red-500">{c.price === 0 ? "Miễn phí" : formatPrice(c.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-[30%] space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm divide-y divide-gray-100">
              <div className="p-4">
                <h3 className="text-base font-bold text-green-600 mb-3">Khóa học mới</h3>
              </div>
              {newCourses.map(c => (
                <div key={c.id} onClick={() => navigate(`/course/${c.id}`)} className="flex gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors group">
                  <img src={c.imageUrl || c.image} alt={c.name} className="w-16 h-16 rounded-full object-cover border border-gray-200 flex-shrink-0 group-hover:border-blue-400 transition-colors" />
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-xs font-medium text-gray-700 group-hover:text-blue-600 line-clamp-2 leading-snug mb-1">{c.name}</p>
                    <p className="text-xs text-blue-400 line-through">{originalPrice(c.price)}</p>
                    <p className="text-sm font-bold text-gray-800">{c.price === 0 ? "Miễn phí" : formatPrice(c.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: "🏆", title: "Uy tín chất lượng", desc: "Hoàn tiền nếu khóa học không như mô tả" },
                { icon: "⚡", title: "Kích hoạt nhanh", desc: "Kích hoạt khóa học tự động" },
                { icon: "🔄", title: "Update liên tục", desc: "Cập nhật 7-15 khóa học mới hằng tuần" },
                { icon: "📱", title: "Học online tiện lợi", desc: "Học online bằng điện thoại hoặc máy tính" },
              ].map((b, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{b.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ===================== DESC TAB =====================
function DescTab({ course, targetAudience, lessonList }) {
  return (
    <div className="p-6 text-gray-700 text-sm leading-relaxed">
      <h2 className="text-xl font-bold text-orange-500 mb-2">{course.name} Là Chìa Khóa Thăng Tiến Sự Nghiệp</h2>
      <p className="mb-4">
        <strong>{course.name}</strong> là khóa học giúp bạn nắm trọn kiến thức từ cơ bản đến nâng cao,
        áp dụng thực tế ngay vào công việc và cuộc sống. Được thiết kế bởi các chuyên gia hàng đầu
        với phương pháp học thực chiến, dễ hiểu và hiệu quả.
      </p>

      {course.image && (
        <img src={course.image} alt={course.name} className="w-full rounded-lg mb-6 border border-gray-200" />
      )}

      <p className="mb-6 text-gray-600">{course.description}</p>

      {/* Target audience */}
      <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span>⏳</span> Khóa Học Này Dành Cho Ai?
      </h3>
      <div className="border-l-4 border-blue-400 pl-4 mb-6 flex flex-col gap-3">
        {targetAudience.map((item, i) => (
          <p key={i}>
            <span className="text-blue-600">♦ </span>
            <strong>{item.bold}</strong>{item.text}
          </p>
        ))}
      </div>

      {/* Lesson list */}
      <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span>🧠</span> Nội Dung Chính Bạn Sẽ Học:
      </h3>
      <div className="border-l-4 border-blue-400 pl-4 mb-6 flex flex-col gap-1">
        {lessonList.map((l, i) => (
          <p key={i} className="text-blue-600 hover:underline cursor-pointer text-sm">{l.title}</p>
        ))}
      </div>

      {/* Price section */}
      <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
        <span>📌</span> Học phí và ưu đãi
      </h3>
      <p className="mb-6 text-gray-600">
        Khóa học hiện đang có ưu đãi với mức học phí rất hợp lý so với giá trị kiến thức nhận được.
        Đây là khoản đầu tư nhỏ để trang bị cho bạn <strong>"{course.name}"</strong>.
      </p>

      {/* Conclusion */}
      <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
        <span>🚀</span> Kết luận
      </h3>
      <p className="text-gray-700">
        <strong>{course.name}</strong> không chỉ giúp bạn nâng cao kỹ năng, mà còn giúp bạn xây dựng
        uy tín, tạo ảnh hưởng và mở ra nhiều cơ hội trong công việc lẫn cuộc sống. Nếu bạn muốn{" "}
        <strong>tự tin hơn, chuyên nghiệp hơn và nâng cấp giá trị bản thân</strong>, đây là khóa học
        rất đáng để đầu tư.
      </p>
    </div>
  );
}

// ===================== LEARN TAB =====================
function LearnTab({ chapters = [], lessonFiles = {}, course = {}, hasPurchased = false }) {
  const [openChapters, setOpenChapters] = useState(() => chapters?.map(() => true) || []);
  const [activeFile, setActiveFile] = useState(null);
  const isFree = ((course?.type || "").toLowerCase() === "free") || Number(course?.price) === 0;
  const isPaidCourse = course && !isFree;
  const courseLocked = isPaidCourse && !hasPurchased;
  const totalLessons = chapters?.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0) || 0;
  const totalFiles = chapters?.reduce((sum, ch) => sum + (ch.lessons?.reduce((lessonSum, lesson) => lessonSum + (lessonFiles?.[lesson.id]?.length || 0), 0) || 0), 0) || 0;

  const toggleChapter = (index) => {
    setOpenChapters(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const openFile = (file) => {
    if (!file) return;
    let url = file.url || file.path || file.fileUrl;
    if (!url) return;
    setActiveFile({ ...file, url, fileType: file.fileType || file.type || "" });
  };

  const closeFile = () => setActiveFile(null);

  const renderFilePreview = (file) => {
    const url = String(file?.url || file?.path || file?.fileUrl || "");
    const lower = url.toLowerCase();
    const fileType = file?.fileType || file?.type || "";

    // YouTube embed
    const isYoutube = fileType === "video/youtube" ||
                      lower.includes("youtube.com/embed") ||
                      lower.includes("youtu.be/");

    if (isYoutube) {
      let embedUrl = url;
      if (lower.includes("youtube.com/watch")) {
        const videoId = new URL(url).searchParams.get("v");
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (lower.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      return (
        <iframe
          title={file.name || file.title || "Video bài học"}
          src={embedUrl}
          className="w-full h-[70vh] border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // Google Docs embed (chuyển /edit -> /preview)
    const isGoogleDoc = fileType === "application/gdoc" ||
                        lower.includes("docs.google.com/document");
    if (isGoogleDoc) {
      const previewUrl = url.replace(/\/edit.*$/, "/preview").replace(/\/view.*$/, "/preview");
      return (
        <iframe
          title={file.name || file.title || "Tài liệu Google Docs"}
          src={previewUrl}
          className="w-full h-[70vh] border-none"
          allow="autoplay"
        />
      );
    }

    // Google Drive (folder/file) — không embed được, mở tab mới
    const isGoogleDrive = fileType === "application/gpdf" ||
                          lower.includes("drive.google.com");
    if (isGoogleDrive) {
      // Nếu là file Drive (có /file/d/), chuyển sang preview
      if (lower.includes("drive.google.com/file/d/")) {
        const previewUrl = url.replace(/\/view.*$/, "/preview").replace(/\/edit.*$/, "/preview");
        return (
          <iframe
            title={file.name || file.title || "Tài liệu PDF"}
            src={previewUrl}
            className="w-full h-[70vh] border-none"
          />
        );
      }
      // Folder Drive — mở tab mới
      return (
        <div className="flex flex-col items-center justify-center h-[40vh] gap-4 text-slate-600">
          <span className="text-5xl">📁</span>
          <p className="text-base font-medium">Tài liệu lưu trên Google Drive</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Mở Google Drive
          </a>
        </div>
      );
    }

    const isVideo = lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg');
    const isPdf = lower.endsWith('.pdf');
    const isHtml = lower.endsWith('.html');

    if (isVideo) {
      return (
        <video controls className="w-full h-[70vh] bg-black" src={url}>
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      );
    }
    if (isPdf || isHtml) {
      return (
        <iframe title={file.name || 'Preview'} src={url} className="w-full h-[70vh] border-none" />
      );
    }
    return (
      <div className="p-6 text-center text-sm text-slate-600">
        Đây là tệp không thể xem trực tiếp.{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Mở tệp trong tab mới
        </a>.
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 relative">
      {activeFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{activeFile.name || activeFile.title || 'Xem nội dung'}</h3>
                <p className="text-xs text-slate-500">{activeFile.url?.split('/').pop()}</p>
              </div>
              <button type="button" onClick={closeFile} className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100">Đóng</button>
            </div>
            <div className="bg-slate-900 p-4">
              {renderFilePreview(activeFile)}
            </div>
          </div>
        </div>
      )}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4 text-green-700 text-sm font-medium">
          <Lock size={18} className="text-green-600" />
          {courseLocked ? (
            <span>Đăng ký khóa học để mở khóa toàn bộ nội dung bài giảng và tài nguyên học tập</span>
          ) : (
            <span>Khóa học đã mở, bạn có thể xem toàn bộ nội dung bài giảng và tài nguyên học tập</span>
          )}
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">📚</span>
                <span>Bài học</span>
              </div>
              <p className="text-sm text-slate-500">{totalLessons} bài học • {totalFiles} tài nguyên</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-700">0%</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{totalFiles} tệp</span>
            </div>
          </div>
        </div>
      </div>

      {chapters && chapters.length > 0 ? (
        chapters.map((chapter, index) => {
          const isOpen = openChapters[index] ?? true;
          return (
            <div key={chapter.id || index} className="rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleChapter(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">{index + 1}</span>
                  <div>
                    <div>{chapter.name || `Chương ${index + 1}`}</div>
                    <div className="text-xs text-slate-500">{chapter.lessons?.length || 0} bài học</div>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
              </button>

              {isOpen && (
                <div className="divide-y divide-slate-200">
                  {chapter.lessons && chapter.lessons.length > 0 ? (
                    chapter.lessons.map((lesson, i) => {
                      const files = lessonFiles?.[lesson.id] || [];
                      const isPreviewLesson = courseLocked && index === 0 && i === 0;
                      const lessonLocked = courseLocked && !isPreviewLesson;
                      return (
                        <div key={lesson.id || i} className="px-5 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${lessonLocked ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                                <PlayCircle size={18} />
                              </div>
                              <div>
                                <div className={`font-medium ${lessonLocked ? 'text-slate-500' : 'text-slate-900'}`}>{lesson.title || `Bài học ${i + 1}`}</div>
                                <div className="text-xs text-slate-500">{files.length} tài nguyên</div>
                              </div>
                            </div>
                            <div className={`text-xs font-semibold ${lessonLocked ? 'text-red-500' : 'text-slate-500'}`}>
                              {lessonLocked ? 'Khóa' : isPreviewLesson ? 'Học thử' : 'Mở'}
                            </div>
                          </div>
                          {lessonLocked ? (
                            <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                              Bài học này chỉ mở khi bạn đã đăng ký khóa học. Vui lòng mua để xem toàn bộ nội dung.
                            </div>
                          ) : (
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              {files.length > 0 ? (
                                files.map((file, j) => {
                                  const fileUrl = file.url || file.path || file.fileUrl;
                                  const fileType = file.fileType || file.type || "";
                                  const lower = String(fileUrl || '').toLowerCase();
                                  const isYoutube = fileType === "video/youtube" || lower.includes("youtube.com/embed") || lower.includes("youtu.be/");
                                  const isGoogleDoc = fileType === "application/gdoc" || lower.includes("docs.google.com");
                                  const isGoogleDrive = fileType === "application/gpdf" || lower.includes("drive.google.com");
                                  const isVideo = !isYoutube && (lower.endsWith('.mp4') || lower.endsWith('.webm'));
                                  const isPdf = lower.endsWith('.pdf');
                                  const icon = isYoutube ? '🎬' : isGoogleDoc ? '📝' : isGoogleDrive ? '📄' : isVideo ? '🎬' : isPdf ? '📄' : '📎';
                                  const displayName = isYoutube ? '▶ Video bài học' : isGoogleDoc ? '📝 Tài liệu bài học' : isGoogleDrive ? '📄 Tài liệu PDF' : (file.name || file.title || fileUrl?.split('/').pop() || `Tệp ${j + 1}`);
                                  return (
                                  <button
                                    key={j}
                                    type="button"
                                    onClick={() => openFile({ ...file, url: fileUrl })}
                                    className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-700 hover:border-blue-300 hover:bg-white"
                                  >
                                    <span>{icon}</span>
                                    <span className="truncate">{displayName}</span>
                                  </button>
                                );
                              })
                            ) : (
                              <p className="text-xs text-slate-500">Chưa có tệp cho bài học này</p>
                            )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-5 py-4 text-sm text-slate-500">Chưa có bài học trong chương này</div>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="rounded-3xl bg-white p-6 text-sm text-slate-500 shadow-sm border border-gray-200">Chưa có nội dung học</div>
      )}
    </div>
  );
}

// ===================== FEATURE CARD =====================
function FeatureCard({ icon, iconBg, title, desc, highlight }) {
  return (
    <div className={`flex gap-3 items-center bg-white rounded-xl p-4 shadow-sm border ${highlight ? "border-blue-400 border-2" : "border-gray-200"} hover:shadow transition-shadow`}>
      <div className={`${iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-800 text-sm mb-0.5">{title}</h4>
        <p className="text-xs text-gray-500 leading-tight">{desc}</p>
      </div>
    </div>
  );
}