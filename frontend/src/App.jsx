import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home"; // Import trang Home vừa tạo
import FreeCourses from "./pages/FreeCourses";
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
        
        {/* Bạn có thể thêm các route khác như /register, /course... ở đây */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;