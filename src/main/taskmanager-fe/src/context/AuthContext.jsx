import { createContext, useState, useEffect, useRef } from "react";
import { getCurrentUser, refreshAccessToken } from "../api/authApi";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (!isFirstRun.current) return;
        isFirstRun.current = false;

        let isMounted = true;

        const checkAutoLogin = async () => {
            setLoading(true);
            try {
                let accessToken = localStorage.getItem("accessToken");
                const refreshToken = localStorage.getItem("refreshToken");

                if (!accessToken && refreshToken) {
                    console.warn("액세스 토큰 없음 → 리프레시 토큰으로 갱신 시도");
                    accessToken = await refreshAccessToken();
                    if (accessToken) {
                        localStorage.setItem("accessToken", accessToken);
                    } else {
                        console.warn("새 토큰 발급 실패 → 로그아웃");
                        logout();
                        return;
                    }
                }

                if (accessToken) {
                    const userData = await getCurrentUser();

                    if (isMounted && userData && JSON.stringify(user) !== JSON.stringify(userData)) {
                        setUser(userData);
                    }
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    console.warn("세션 만료 → 로그아웃");
                    logout();
                } else {
                    console.error("유저 정보 조회 실패:", error);
                }
            }

            if (isMounted) setLoading(false);
        };

        checkAutoLogin();

        return () => {
            isMounted = false;
        };
    }, []);

    const login = async (accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        try {
            const userData = await getCurrentUser();

            if (JSON.stringify(user) !== JSON.stringify(userData)) {
                setUser(userData);
            }
        } catch (error) {
            console.error("로그인 후 유저 정보 조회 실패:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
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
