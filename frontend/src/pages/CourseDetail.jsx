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

  return(
    <div style={styles.page}>
      <Header/>

      <main style={styles.main}>
        <div style={styles.hero}>
          {/* Left */}
          <div>
            <img
              src={course.image || "https://via.placeholder.com/800x450"}
              alt={course.name}
              style={styles.image}
            />

            <div style={styles.rowBtns}>
              <button style={styles.yellowBtn}>
                <MessageCircle size={16}/>
                Trao đổi KH
              </button>

              <button style={styles.greenBtn}>
                <PlayCircle size={16}/>
                Học thử
              </button>
            </div>
          </div>

          {/* Center */}
          <div>
            <h1>{course.name}</h1>

            <div style={{margin:"15px 0"}}>
              <span style={styles.price}>
                {isFree ? "Miễn phí" : formatPrice(course.price)}
              </span>

              {!isFree && (
                <span style={styles.oldPrice}>
                  {formatPrice(course.price*1.5)}
                </span>
              )}
            </div>

            <p><Clock size={14}/> 59 Bài giảng</p>
            <p><FileText size={14}/> Online</p>

            <div style={{marginTop:"25px"}}>
              <button style={styles.outlineBtn}>
                <UserCircle size={16}/>
                Nâng cấp hội viên
              </button>

              <button style={styles.grayBtn}>
                <Star size={16}/>
                Cộng đồng
              </button>

              <div style={styles.buyRow}>
                <button style={styles.darkBtn}>
                  <ShoppingCart size={16}/>
                  Giỏ hàng
                </button>

                <button style={styles.blueBtn}>
                  Thanh toán
                </button>
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            <Feature
              icon={<FileText size={20}/>}
              title="Đầy đủ bài giảng"
              desc="Video và tài liệu đầy đủ"
            />

            <Feature
              icon={<PlayCircle size={20}/>}
              title="Học online tiện lợi"
              desc="Học trên điện thoại và máy tính"
            />

            <Feature
              icon={<CheckCircle size={20}/>}
              title="Kích hoạt nhanh"
              desc="Nhận khóa học trong vài giây"
            />
          </div>
        </div>

        <div style={styles.contentWrap}>
          {/* main */}
          <div style={styles.contentBox}>
            <div style={styles.tabs}>
              <button
                onClick={()=>setActiveTab("desc")}
                style={
                  activeTab==="desc"
                  ? styles.activeTab
                  : styles.tab
                }
              >
                Mô tả
              </button>

              <button
                onClick={()=>setActiveTab("learn")}
                style={
                  activeTab==="learn"
                  ? styles.activeTab
                  : styles.tab
                }
              >
                Vào học
              </button>
            </div>

            <div style={{padding:25}}>
              {activeTab==="desc" ? (
                course.description
                ? <div dangerouslySetInnerHTML={{__html:course.description}}/>
                : <p>Chưa có mô tả khóa học.</p>
              ) : (
                <div style={{textAlign:"center"}}>
                  Nội dung đang cập nhật...
                </div>
              )}
            </div>
          </div>

          {/* sidebar */}
          <div>
            <h3>Khóa học mới</h3>

            {newCourses.map(c=>(
              <div
                key={c.id}
                onClick={()=>navigate(`/course/${c.id}`)}
                style={styles.sideItem}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  style={styles.sideImg}
                />

                <div>
                  <div>{c.name}</div>
                  <b>{formatPrice(c.price)}</b>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer/>
    </div>
  );
}

function Feature({icon,title,desc}){
  return(
    <div style={styles.feature}>
      {icon}
      <div>
        <b>{title}</b>
        <p style={{margin:0,fontSize:12}}>
          {desc}
        </p>
      </div>
    </div>
  );
}

const styles={
 page:{
  minHeight:"100vh",
  background:"#f8fafc"
 },
 main:{
  maxWidth:1200,
  margin:"auto",
  padding:20
 },
 hero:{
  display:"grid",
  gridTemplateColumns:"1.2fr 1fr .8fr",
  gap:20,
  background:"#fff",
  padding:20,
  borderRadius:12
 },
 image:{
  width:"100%",
  borderRadius:8
 },
 rowBtns:{
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:10,
  marginTop:12
 },
 yellowBtn:{
  padding:10
 },
 greenBtn:{
  padding:10
 },
 price:{
  fontSize:28,
  fontWeight:800,
  color:"#2563eb",
  marginRight:10
 },
 oldPrice:{
  textDecoration:"line-through"
 },
 outlineBtn:{
  width:"100%",
  padding:12,
  marginBottom:10
 },
 grayBtn:{
  width:"100%",
  padding:12,
  marginBottom:10
 },
 buyRow:{
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:10
 },
 darkBtn:{padding:12},
 blueBtn:{padding:12},
 feature:{
  display:"flex",
  gap:12,
  background:"#fff",
  padding:14,
  borderRadius:8,
  marginBottom:12
 },
 contentWrap:{
  display:"grid",
  gridTemplateColumns:"1fr 300px",
  gap:30,
  marginTop:30
 },
 contentBox:{
  background:"#fff",
  borderRadius:12
 },
 tabs:{
  display:"flex",
  borderBottom:"1px solid #ddd"
 },
 tab:{
  padding:15,
  border:"none",
  background:"white"
 },
 activeTab:{
  padding:15,
  border:"none",
  borderBottom:"2px solid blue",
  background:"white"
 },
 sideItem:{
  display:"flex",
  gap:10,
  padding:10,
  background:"#fff",
  marginBottom:10,
  cursor:"pointer",
  borderRadius:8
 },
 sideImg:{
  width:80,
  height:60,
  objectFit:"cover"
 },
 btn:{
  padding:"10px 20px"
 }
};