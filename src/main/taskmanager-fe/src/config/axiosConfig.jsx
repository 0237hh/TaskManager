import axios from "axios";

export const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔍 요청 인터셉터 추가 (토큰 설정 확인용)
instance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem("token");
        if (token) {
            try { token = JSON.parse(token); } catch (e) {}
            if (typeof token === "string" && token.startsWith("ey")) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                localStorage.removeItem("token"); // ❗ 잘못된 토큰 삭제
            }
        } else { console.warn("⚠️ 토큰이 존재하지 않습니다."); }
        return config;
    },
    (error) => Promise.reject(error)
);
