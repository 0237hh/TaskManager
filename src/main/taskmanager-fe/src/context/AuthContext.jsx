import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/authApi";
import { getUserFromToken } from "../utils/authUtils";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) { return; }

        const parsedUser = getUserFromToken(token);
        if (parsedUser) {
            setUser(parsedUser);
        }

        getCurrentUser()
            .then((data) => {
                setUser(data);
            })
            .catch((error) => {
                console.error("❌ 사용자 정보 가져오기 실패:", error);
                if (error.status === 401) {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            });
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setUser(getUserFromToken(token));
        window.location.href = "/tasks"; // 🔄 로그인 후 이동
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login"; // 🔄 로그아웃 후 이동
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
