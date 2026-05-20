import { createContext, useState, useEffect } from "react";

// DÒNG QUAN TRỌNG NHẤT: Phải có "export" ở đây
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Khởi tạo state đồng bộ từ localStorage để tránh bị "đá" ra trang chủ
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                return null;
            }
        }
        return null;
    });

    const loginUser = (data) => {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};