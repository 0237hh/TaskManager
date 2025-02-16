import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || "로그인 실패";
    }
};

export const register = async (email, password, username) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, { email, password, username });
        return response.data;
    } catch (error) {
        throw error.response?.data || "회원가입 실패";
    }
};

export const getCurrentUser = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || "사용자 정보 가져오기 실패";
    }
};
