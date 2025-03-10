import axios from "axios";

export const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    }
});

instance.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            try {
                accessToken = JSON.parse(accessToken);
            } catch (e) {}

            if (typeof accessToken === "string" && accessToken.startsWith("ey")) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            } else {
                console.warn("잘못된 accessToken → 제거");
                localStorage.removeItem("accessToken");
            }
        } else {
            console.warn("accessToken이 존재하지 않습니다.");
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

            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        "http://localhost:8080/api/auth/refresh",
                        { refreshToken },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    const newAccessToken = response.data.accessToken;
                    if (newAccessToken) {
                        localStorage.setItem("accessToken", JSON.stringify(newAccessToken));
                        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return axios(originalRequest);
                    }
                } catch (refreshError) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    logout();
                }
            } else {
                console.warn("리프레시 토큰이 존재하지 않습니다.");
                logout();
            }
        }
        return Promise.reject(error);
    }
);

function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
}
