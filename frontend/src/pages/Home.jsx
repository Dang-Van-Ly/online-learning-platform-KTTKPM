import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#fff",
        },
        mainContent: {
            flex: "1 0 auto",
            padding: "40px 20px",
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box"
        },
        welcomeSection: {
            textAlign: "center",
            marginTop: "50px"
        }
    };

    return (
        <div style={styles.container}>
            {/* 1. Header nằm trên cùng */}
            <Header />

            {/* 2. Nội dung chính của trang Home */}
            <main style={styles.mainContent}>
                <div style={styles.welcomeSection}>
                    <h1>Chào mừng bạn đến với Kho Khóa Học</h1>
                    <p>Khám phá hàng ngàn khóa học chất lượng với chi phí tiết kiệm nhất.</p>
                </div>
                
                {/* Bạn có thể thêm danh sách khóa học hoặc banner ở đây */}
            </main>

            {/* 3. Footer nằm dưới cùng */}
            <Footer />
        </div>
    );
}