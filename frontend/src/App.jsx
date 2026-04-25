import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home"; // Import trang Home vừa tạo
import Register from './pages/Register';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👉 Mặc định vào "/" sẽ hiển thị trang Home */}
        <Route path="/" element={<Home />} />

        {/* Trang login */}
        <Route path="/login" element={<Login />} />
        
        {/* Bạn có thể thêm các route khác như /register, /course... ở đây */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;