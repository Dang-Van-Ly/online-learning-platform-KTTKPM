import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Membership from "./pages/Membership";
import OrderSuccess from "./pages/OrderSuccess";
import FilteredCourses from "./pages/FilteredCourses";
import SearchCourses from "./pages/SearchCourses";
import CourseDetail from "./pages/CourseDetail";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Instructor routes
import InstructorLayout from "./layouts/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CourseList from "./components/instructor/CourseList";
import CourseForm from "./components/instructor/CourseForm";
import EarningsPage from "./pages/instructor/EarningsPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/course/:id" element={<CourseDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/gio-hang" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="create" element={<CourseForm />} />
          <Route path="edit/:id" element={<CourseForm />} />
          <Route path="earnings" element={<EarningsPage />} />
        </Route>

        <Route path="/filtered-courses" element={<FilteredCourses />} />

        <Route path="/search" element={<SearchCourses />} />

        {/* redirect */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;