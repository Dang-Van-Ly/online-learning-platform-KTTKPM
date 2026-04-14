import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginUser = (data) => {
        setUser(data);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser }}>
            {children}
        </AuthContext.Provider>
    );
};