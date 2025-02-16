import { createContext, useState, useEffect } from "react";
import { getUserFromToken } from "../utils/authUtils";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setUser(getUserFromToken(token));
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setUser(getUserFromToken(token));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext , AuthProvider};