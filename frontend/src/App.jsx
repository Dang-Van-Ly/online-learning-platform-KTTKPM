import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home"; // Import trang Home vừa tạo
import FreeCourses from "./pages/FreeCourses";
import SearchCourses from "./pages/SearchCourses";
import CourseDetail from "./pages/CourseDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👉 Mặc định vào "/" sẽ hiển thị trang Home */}
        <Route path="/" element={<Home />} />

        {/* Trang login */}
        <Route path="/login" element={<Login />} />

        {/* Trang khóa học miễn phí */}
        <Route path="/free-courses" element={<FreeCourses />} />
        
        {/* Trang tìm kiếm và lọc khóa học */}
        <Route path="/search" element={<SearchCourses />} />
        
        {/* Trang chi tiết khóa học */}
        <Route path="/course/:id" element={<CourseDetail />} />
        
        {/* Bạn có thể thêm các route khác như /register ở đây */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;