import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/authApi";
import { getUserFromToken } from "../utils/authUtils";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAutoLogin();
    }, []);

    const checkAutoLogin = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const parsedUser = getUserFromToken(token);
            if (parsedUser) {
                setUser(parsedUser);
            }

            const data = await getCurrentUser();
            setUser(data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn("세션 만료 - 로그아웃 처리");
                logout();
            } else {
                console.error("유저 정보 조회 실패:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = (token) => {
        localStorage.setItem("token", token);
        setUser(getUserFromToken(token));
        window.location.href = "/tasks";
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
