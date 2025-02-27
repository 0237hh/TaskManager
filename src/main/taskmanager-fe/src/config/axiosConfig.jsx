import axios from "axios";

export const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem("token");
        if (token) {
            try { token = JSON.parse(token); } catch (e) {}
            if (typeof token === "string" && token.startsWith("ey")) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                localStorage.removeItem("token");
            }
        } else { console.warn("토큰이 존재하지 않습니다."); }
        return config;
    },
    (error) => Promise.reject(error)
);
