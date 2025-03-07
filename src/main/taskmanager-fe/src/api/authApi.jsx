import {instance} from "../config/axiosConfig.jsx";
import {getUserFromToken} from "../utils/authUtils.jsx";

export const login = async (email, password) => {
    try {
        const response = await instance.post("/auth/login", { email, password });

        console.log("로그인 응답 데이터:", response.data);

        const { accessToken, refreshToken } = response.data;

        if (accessToken && refreshToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        } else {
            console.error("응답에 토큰 없음");
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


export const getCurrentUser = async () => {
    try {
        const response = await instance.get("/auth/me");
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn("인증 만료 - 로그인 페이지로 이동");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        throw error.response?.data || "사용자 정보 가져오기 실패";
    }
};
