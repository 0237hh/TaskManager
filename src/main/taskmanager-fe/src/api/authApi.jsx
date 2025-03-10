import {instance} from "../config/axiosConfig.jsx";
import {getUserFromToken} from "../utils/authUtils.jsx";
import axios from "axios";

export const login = async (email, password) => {
    try {
        const response = await instance.post("/auth/login", { email, password });

        const { accessToken, refreshToken } = response.data;

        if (accessToken && refreshToken) {
            localStorage.setItem("accessToken", JSON.stringify(accessToken));
            localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
            instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        } else {
            throw new Error("서버 응답에 토큰 정보가 없습니다.");
        }
        return response.data;
    } catch (error) {
        console.error("로그인 실패:", error.response);
        throw error.response?.data || "로그인 실패";
    }
};

export const register = async (email, password, username) => {
    try {
        const response = await instance.post("/auth/register", { email, password, username });
        console.log("회원가입 성공:", response.data);

        const loginResponse = await login(email, password);

        const { accessToken, refreshToken } = loginResponse;

        if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
            throw new Error("서버에서 반환한 토큰이 유효하지 않습니다.");
        }

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        return getUserFromToken(accessToken);

    } catch (error) {
        console.error("회원가입 실패:", error);
        throw error.response?.data || "회원가입 실패";
    }
};

export const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            logout();
            return null;
        }

        const response = await axios.post("http://localhost:8080/api/auth/refresh", {}, { withCredentials: true });

        if (response.data.accessToken) {
            localStorage.setItem("accessToken", response.data.accessToken);
            instance.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
            return response.data.accessToken;
        } else {
            console.warn("리프레시 토큰 만료 → 로그아웃");
            logout();
            return null;
        }
    } catch (error) {
        console.error("토큰 갱신 실패:", error);
        logout();
        return null;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await instance.get("/auth/me");
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
                return getCurrentUser();
            } else {
                console.warn("새 토큰 발급 실패 → 로그아웃");
                logout();
            }
        }
        throw error.response?.data || "사용자 정보 가져오기 실패";
    }
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    instance.defaults.headers.common["Authorization"] = "";
    window.location.href = "/login";
};