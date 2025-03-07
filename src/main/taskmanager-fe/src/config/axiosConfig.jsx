import axios from "axios";

export const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem("token");

        if (token) {
            try {
                token = JSON.parse(token);
            } catch (e) {}

            if (typeof token === "string" && token.startsWith("ey")) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                localStorage.removeItem("token");
            }
        } else {
            console.warn("토큰이 존재하지 않습니다.");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = getRefreshTokenFromCookie();

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        "http://localhost:8080/api/auth/refresh",
                        {},
                        { headers: { Authorization: `Bearer ${refreshToken}` } }
                    );
                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem("token", JSON.stringify(newAccessToken));
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    console.error("리프레시 토큰 갱신 실패", refreshError);
                }
            } else {
                console.warn("리프레시 토큰이 존재하지 않습니다.");
            }
        }
        return Promise.reject(error);
    }
);

function getRefreshTokenFromCookie() {
    const cookies = document.cookie.split("; ");
    const refreshTokenCookie = cookies.find(cookie => cookie.startsWith("refreshToken="));
    return refreshTokenCookie ? refreshTokenCookie.split("=")[1] : null;
}
