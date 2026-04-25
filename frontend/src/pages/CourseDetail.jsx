import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCourseById, getAllCourses } from "../api/courseApi";
import {
  ShoppingCart,
  PlayCircle,
  Star,
  MessageCircle,
  FileText,
  CheckCircle,
  Clock,
  UserCircle
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course,setCourse]=useState(null);
  const [loading,setLoading]=useState(true);
  const [newCourses,setNewCourses]=useState([]);
  const [activeTab,setActiveTab]=useState("desc");

  useEffect(()=>{
    const fetchData = async()=>{
      setLoading(true);

      const data = await getCourseById(id);
      setCourse(data);

      const all = await getAllCourses();

      const sorted = all
        .sort((a,b)=>(b.id||0)-(a.id||0))
        .slice(0,3);

      setNewCourses(sorted);

      setLoading(false);
    };

    if(id){
      fetchData();
    }
  },[id]);

  const formatPrice=(price)=>
    price
      ? new Intl.NumberFormat("vi-VN").format(price)+"đ"
      : "0đ";

  if(loading){
    return (
      <>
        <Header/>
        <div style={{padding:"80px",textAlign:"center"}}>
          Đang tải dữ liệu...
        </div>
        <Footer/>
      </>
    );
  }

  if(!course){
    return (
      <>
        <Header/>
        <div style={{padding:"80px",textAlign:"center"}}>
          <h2>Không tìm thấy khóa học</h2>
          <button
            onClick={()=>navigate("/")}
            style={styles.btn}
          >
            Quay về trang chủ
          </button>
        </div>
        <Footer/>
      </>
    );
  }

  const isFree =
    (course.type||"").toLowerCase()==="free"
    || course.price===0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-grow">
        {/* HERO SECTION */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col lg:flex-row gap-8 mb-8">
          {/* Left Column: Image & Buttons */}
          <div className="lg:w-[35%] flex flex-col gap-4">
            <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
              <img
                src={course.image || "https://via.placeholder.com/800x450"}
                alt={course.name}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded shadow transition-colors text-sm">
                <MessageCircle size={16} />
                Trao đổi KH
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#65a30d] hover:bg-green-700 text-white font-semibold py-2.5 rounded shadow transition-colors text-sm">
                <PlayCircle size={16} />
                Học Thử
              </button>
            </div>
          </div>

          {/* Center Column: Course Info */}
          <div className="lg:w-[35%] flex flex-col">
            <h1 className="text-[22px] font-bold text-gray-800 mb-4 leading-snug">
              {course.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-4 pb-4">
              <span className="text-3xl font-black text-[#3b82f6]">
                {isFree ? "Miễn phí" : formatPrice(course.price)}
              </span>
              <span className="text-gray-400 line-through text-base font-semibold">
                {!isFree && formatPrice(course.price ? course.price * 1.5 : 1500000)}
              </span>
            </div>

            <div className="flex flex-col gap-2 mb-6 text-[13px]">
              <div className="flex items-center gap-8 px-1 py-1">
                 <span className="text-gray-500 min-w-[80px]">Thời lượng</span>
                 <span className="font-semibold bg-gray-100 text-gray-700 px-8 py-1 rounded w-full text-center">54 Bài Giảng</span>
              </div>
              <div className="flex items-center gap-8 px-1 py-1">
                 <span className="text-gray-500 min-w-[80px]">Loại khóa học</span>
                 <span className="font-semibold bg-gray-100 text-gray-700 px-8 py-1 rounded w-full text-center whitespace-nowrap overflow-hidden text-ellipsis">Khóa học dành cho Hội Viên</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <button className="flex justify-center items-center gap-2 border-2 border-[#ef4444] text-[#ef4444] hover:bg-red-50 font-bold py-2.5 rounded transition text-sm">
                <UserCircle size={18} />
                Nâng Cấp Gói Hội Viên Ngay
              </button>
              <button className="flex justify-center items-center gap-2 border-2 border-gray-800 text-gray-800 hover:bg-gray-50 font-bold py-2.5 rounded transition text-sm">
                <Star size={18} />
                Nhóm Cộng Đồng Kho Khóa Học
              </button>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button className="flex justify-center items-center gap-2 bg-[#3b5998] hover:bg-blue-800 text-white font-bold py-2.5 rounded shadow text-sm">
                  <ShoppingCart size={18} />
                  Thêm vào giỏ
                </button>
                <button className="flex justify-center items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 rounded shadow text-sm">
                  <FileText size={18} />
                  Thanh toán ngay
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Features */}
          <div className="lg:w-[30%] flex flex-col gap-3">
            <Feature
              icon={<PlayCircle size={28} className="text-red-500" />}
              title="Đầy Đủ Bài Giảng"
              desc="Cam kết video bài giảng và tài liệu giống mô tả"
              borderColor="border-blue-400"
            />
            <Feature
              icon={<Clock size={28} className="text-blue-400" />}
              title="Học Online Tiện Lợi"
              desc="Học online trên Website bằng điện thoại hoặc máy tính"
              borderColor="border-gray-200"
            />
            <Feature
              icon={<CheckCircle size={28} className="text-yellow-500" />}
              title="Kích Hoạt Nhanh"
              desc="Nhận khóa học trong vòng 3-5 giây"
              borderColor="border-gray-200"
            />
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content (Tabs & Description) */}
          <div className="lg:w-[70%]">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden min-h-[400px]">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("desc")}
                  className={`px-6 py-3 font-semibold text-sm transition-colors ${
                    activeTab === "desc"
                      ? "text-gray-800 bg-white border-t-2 border-t-blue-500 border-r border-r-gray-200"
                      : "text-gray-500 hover:text-blue-600 bg-gray-50"
                  }`}
                >
                  Mô tả
                </button>
                <button
                  onClick={() => setActiveTab("learn")}
                  className={`px-6 py-3 font-semibold text-sm transition-colors ${
                    activeTab === "learn"
                      ? "text-gray-800 bg-white border-t-2 border-t-blue-500 border-x border-x-gray-200"
                      : "text-gray-500 hover:text-blue-600 bg-gray-50"
                  }`}
                >
                  Vào học
                </button>
              </div>
              
              <div className="p-8 text-gray-700 leading-relaxed text-[15px]">
                {activeTab === "desc" ? (
                  course.description ? (
                    <div dangerouslySetInnerHTML={{ __html: course.description }} />
                  ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-orange-500 mb-4">{course.name}</h2>
                        <p>Ứng dụng AI (Generative AI) Cho Người Làm Văn Phòng là khóa học thực chiến giúp bạn biết cách dùng AI để làm việc nhanh hơn, thông minh hơn và hiệu quả hơn trong môi trường công sở hiện đại.</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-10 text-gray-500">Nội dung bài học đang được cập nhật...</div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar (New Courses) */}
          <div className="lg:w-[30%]">
            <h3 className="text-[17px] font-semibold text-[#84cc16] mb-4">Khóa học mới</h3>
            <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-4">
              {newCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/course/${c.id}`)}
                  className="flex gap-4 cursor-pointer group pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="w-[70px] h-[70px] flex-shrink-0">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover rounded-full border border-gray-200 group-hover:border-blue-400 transition-colors shadow-sm"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-[13px] font-medium text-gray-700 group-hover:text-blue-600 line-clamp-3 leading-snug mb-1">
                      {c.name}
                    </h4>
                    <div className="text-[11px] text-[#3b82f6] line-through mb-0.5">
                      {formatPrice(c.price ? c.price * 1.5 : 1500000)}
                    </div>
                    <div className="text-[13px] font-bold text-gray-800">
                      {isFree || !c.price ? "1đ" : formatPrice(c.price)}
                    </div>
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

function Feature({ icon, title, desc, borderColor }) {
  return (
    <div className={`flex gap-4 items-center bg-white border-2 ${borderColor} rounded-xl p-4 shadow-sm hover:shadow transition-shadow h-full`}>
      <div className="flex-shrink-0 bg-gray-50 p-2 rounded-lg">{icon}</div>
      <div>
        <h4 className="font-bold text-gray-800 text-[13px] mb-1">{title}</h4>
        <p className="text-[11px] text-gray-500 leading-tight">{desc}</p>
      </div>
    </div>
  );
}