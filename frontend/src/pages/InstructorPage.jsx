import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CourseList from "../components/instructor/CourseList";
import CourseForm from "../components/instructor/CourseForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function InstructorPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("My Courses");
    const [editCourse, setEditCourse] = useState(null);

    useEffect(() => {
        // Protect this route: only INSTRUCTOR should access it
        const savedUserStr = localStorage.getItem('user');
        if (savedUserStr) {
            try {
                const savedUser = JSON.parse(savedUserStr);
                if (savedUser.role !== "INSTRUCTOR" && savedUser.role !== "INSTRUCTOR_ROLE") {
                    navigate("/");
                }
            } catch (e) {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleEdit = (course) => {
        setEditCourse(course);
        setActiveTab("Create Course");
    };

    const handleSuccess = () => {
        setEditCourse(null);
        setActiveTab("My Courses");
    };

    const styles = {
        container: {
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: "#f9f9f9",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            color: "#333"
        },
        content: {
            flex: "1 0 auto",
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            padding: "40px 20px"
        },
        title: {
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px"
        },
        tabContainer: {
            marginBottom: "20px",
            display: "flex",
            gap: "10px"
        },
        tabButton: (isActive) => ({
            padding: "10px 20px",
            backgroundColor: isActive ? "#2e6eef" : "#fff",
            color: isActive ? "#fff" : "#333",
            border: "1px solid #ddd",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: isActive ? "bold" : "normal",
            transition: "all 0.3s"
        })
    };

    return (
        <div style={styles.container}>
            <Header />
            <div style={styles.content}>
                <h2 style={styles.title}>Instructor Dashboard</h2>
                
                <div style={styles.tabContainer}>
                    <button 
                        style={styles.tabButton(activeTab === "My Courses")}
                        onClick={() => { setActiveTab("My Courses"); setEditCourse(null); }}
                    >
                        My Courses
                    </button>
                    <button 
                        style={styles.tabButton(activeTab === "Create Course")}
                        onClick={() => { setActiveTab("Create Course"); setEditCourse(null); }}
                    >
                        {editCourse ? "Edit Course" : "Create Course"}
                    </button>
                </div>

                {activeTab === "My Courses" && <CourseList onEdit={handleEdit} />}
                {activeTab === "Create Course" && <CourseForm courseToEdit={editCourse} onSuccess={handleSuccess} />}
            </div>
            <Footer />
        </div>
    );
}
