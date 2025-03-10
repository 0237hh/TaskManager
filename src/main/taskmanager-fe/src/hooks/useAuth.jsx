import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { instance } from "../config/axiosConfig.jsx";

const useAuth = () => {
    const { user, setUser, login, logout } = useContext(AuthContext);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            try {
                instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            } catch (error) {
                console.error("토큰 설정 실패:", error);
            }
        } else {
            console.warn("토큰이 존재하지 않습니다.");
        }
    }, []);

    return { user, setUser, login, logout };
};

export default useAuth;
