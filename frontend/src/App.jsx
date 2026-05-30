import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import FilteredCourses from "./pages/FilteredCourses";
import SearchCourses from "./pages/SearchCourses";
import CourseDetail from "./pages/CourseDetail";
import Register from "./pages/Register";
import Blog from "./pages/Blog";

// Instructor routes
import InstructorLayout from "./layouts/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CourseList from "./components/instructor/CourseList";
import CourseForm from "./components/instructor/CourseForm";
import EarningsPage from "./pages/instructor/EarningsPage";
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
                <Route path="/profile" element={<Profile />} />

                {/* --- KHU VỰC GIẢNG VIÊN --- */}
                <Route path="/instructor" element={<InstructorLayout />}>
                    <Route index element={<InstructorDashboard />} />
                    <Route path="courses" element={<CourseList />} />
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
                <Route path="/blog" element={<Blog />} />

                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;