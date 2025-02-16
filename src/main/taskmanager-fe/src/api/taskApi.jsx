import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/tasks";

export const getTasks = async (token) => {
    try {
        const response = await axios.get(API_BASE_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || "할 일 목록 가져오기 실패";
    }
};

export const createTask = async (taskData, token) => {
    try {
        const response = await axios.post(API_BASE_URL, taskData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || "할 일 생성 실패";
    }
};

export const updateTask = async (taskId, updatedData, token) => {
    try {
        await axios.put(`${API_BASE_URL}/${taskId}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        throw error.response?.data || "할 일 수정 실패";
    }
};

export const deleteTask = async (taskId, token) => {
    try {
        await axios.delete(`${API_BASE_URL}/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        throw error.response?.data || "할 일 삭제 실패";
    }
};

export const updateTaskOrder = async (taskIds, token) => {
    try {
        await axios.put(`${API_BASE_URL}/order`, taskIds, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        throw error.response?.data || "할 일 순서 변경 실패";
    }
};

export const completeTask = async (taskId, token) => {
    try {
        await axios.put(`${API_BASE_URL}/${taskId}/done`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        throw error.response?.data || "할 일 완료 처리 실패";
    }
};
