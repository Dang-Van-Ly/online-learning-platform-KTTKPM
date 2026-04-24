import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home"; // Import trang Home vừa tạo
import Profile from "./pages/Profile";
import CourseDetail from "./pages/CourseDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👉 Mặc định vào "/" sẽ hiển thị trang Home */}
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetail />} />

        {/* Trang login */}
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Bạn có thể thêm các route khác như /register, /course... ở đây */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;