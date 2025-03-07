import { createContext, useState, useEffect } from "react";
import { getCurrentUser, refreshAccessToken } from "../api/authApi";
import { getUserFromToken } from "../utils/authUtils";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAutoLogin();
    }, []);

    const checkAutoLogin = async () => {
        setLoading(true);

        try {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (!accessToken && refreshToken) {
                console.warn("🚨 액세스 토큰 없음 → 리프레시 토큰으로 갱신 시도");
                const newToken = await refreshAccessToken();
                if (newToken) {
                    localStorage.setItem("accessToken", newToken);
                    setUser(getUserFromToken(newToken));
                } else {
                    console.warn("❌ 새 토큰 발급 실패 → 로그아웃");
                    logout();
                    return;
                }
            } else if (accessToken) {
                setUser(getUserFromToken(accessToken));
            }

            const data = await getCurrentUser();
            if (data) {
                setUser(data);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn("🔄 세션 만료 → 로그아웃");
                logout();
            } else {
                console.error("❌ 유저 정보 조회 실패:", error);
            }
        }

        setLoading(false);
    };

    const login = (accessToken, refreshToken) => {
        console.log("🔐 로그인 성공, 토큰 저장:", accessToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setUser(getUserFromToken(accessToken));
    };

    const logout = () => {
        console.log("🚪 로그아웃");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
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
