import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import FreeCourses from "./pages/FreeCourses";
import SearchCourses from "./pages/SearchCourses";
import CourseDetail from "./pages/CourseDetail";
import Register from "./pages/Register";

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
        <Route path="/free-courses" element={<FreeCourses />} />
        <Route path="/search" element={<SearchCourses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;