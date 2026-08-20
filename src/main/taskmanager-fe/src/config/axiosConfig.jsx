import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/refresh",
      {},
      { withCredentials: true }
    );

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
      instance.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
      return response.data.accessToken;
    }
    return null;
  } catch (error) {
    return null;
  }
};

instance.interceptors.request.use(
    async (config) => {
        const publicPaths = ["/auth/login", "/auth/register"];
        const isPublic = publicPaths.some(path => config.url?.includes(path));

        if (!isPublic) {
            let accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                try { accessToken = JSON.parse(accessToken); } catch (e) {}
                if (typeof accessToken === "string" && accessToken.startsWith("ey")) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                } else {
                    localStorage.removeItem("accessToken");
                }
            }
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
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } else {
        logout();
      }
    }
    return Promise.reject(error);
  },
);

export const logout = async () => {
  try {
    await axios.post("http://localhost:8080/api/auth/logout", {}, { withCredentials: true });
  } catch (e) {
    // 실패해도 클라이언트 쪽 로그아웃은 진행
  }
  localStorage.removeItem("accessToken");
  instance.defaults.headers.common["Authorization"] = "";
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};