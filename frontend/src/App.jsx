import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

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
import Guide from "./pages/Guide";
import CourseExchange from "./pages/CourseExchange";
import ChatAgent from "./pages/ChatAgent";

// Instructor routes
import InstructorLayout from "./layouts/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CourseList from "./components/instructor/CourseList";
import CourseForm from "./components/instructor/CourseForm";
import EarningsPage from "./pages/instructor/EarningsPage";
import ChapterManagement from "./pages/instructor/ChapterManagement";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import CourseManagement from "./pages/admin/CourseManagement.jsx";
import AdminStatistics from "./pages/admin/AdminStatistics.jsx";
import OrderManagement from "./pages/admin/OrderManagement.jsx";
import PromotionManagement from "./pages/admin/PromotionManagement.jsx";
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
                <Route path="/agent" element={<ChatAgent />} />
                <Route path="/huong-dan" element={<Guide />} />
                <Route path="/trao-doi" element={<CourseExchange />} />

                {/* --- KHU VỰC GIẢNG VIÊN --- */}
                <Route path="/instructor" element={<InstructorLayout />}>
                    <Route index element={<InstructorDashboard />} />
                    <Route path="courses" element={<CourseList />} />
                    <Route path="courses/:id/chapters" element={<ChapterManagement />} />
                    <Route path="create" element={<CourseForm />} />
                    <Route path="edit/:id" element={<CourseForm />} />
                    <Route path="earnings" element={<EarningsPage />} />
                </Route>

                {/* --- KHU VỰC QUẢN TRỊ (ADMIN) --- */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="statistics" element={<AdminStatistics />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="courses" element={<CourseManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="promotions" element={<PromotionManagement />} />
                </Route>

                <Route path="/filtered-courses" element={<FilteredCourses />} />
                <Route path="/search" element={<SearchCourses />} />

                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;