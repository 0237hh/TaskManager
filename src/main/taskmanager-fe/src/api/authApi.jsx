import {instance} from "../config/axiosConfig.jsx";
import {getUserFromToken} from "../utils/authUtils.jsx";

export const login = async (email, password) => {
    try {
        const response = await instance.post("/auth/login", { email, password });
        const token = response.data.token;
        if (token) {
            localStorage.setItem("token", JSON.stringify(token));
            instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            console.error("응답에 토큰 없음");
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
        const token = loginResponse.token;

        if (typeof token !== "string") {
            throw new Error("서버에서 반환한 토큰이 유효하지 않습니다.");
        }

        localStorage.setItem("token", token);
        const userInfo = getUserFromToken(token);
        console.log("로그인된 사용자 정보:", userInfo);
        return userInfo;

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
            console.warn("오류 발생: 인증 만료됨");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        throw error.response?.data || "사용자 정보 가져오기 실패";
    }
};
