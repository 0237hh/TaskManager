import { instance, refreshAccessToken, logout } from "../config/axiosConfig.jsx";
import { getUserFromToken } from "../utils/authUtils.jsx";
import axios from "axios";

export const login = async (email, password) => {
  try {
    const response = await instance.post("/auth/login", { email, password });
    const { accessToken } = response.data;

    if (accessToken) {
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      throw new Error("서버 응답에 토큰 정보가 없습니다.");
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || "로그인 실패";
  }
};

export const register = async (email, password, username) => {
  try {
    const response = await instance.post("/auth/register", {
      email,
      password,
      username,
    });
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

export const updateUser = async (userName) => {
  try {
    const response = await instance.put("/auth/me", { userName });
    return response.data;
  } catch (error) {
    throw error.response?.data || "정보 수정 실패";
  }
};
