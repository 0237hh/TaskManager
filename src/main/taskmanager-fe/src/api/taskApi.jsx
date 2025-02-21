import { instance } from "../config/axiosConfig";

export const getTasks = async () => {
    try {
        const response = await instance.get("/tasks");
        return response.data;
    } catch (error) {
        console.error("❌ [getTasks] 오류 발생:", error.response);
        throw error.response?.data || "할 일 목록 가져오기 실패";
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await instance.post("/tasks", taskData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "할 일 생성 실패";
    }
};

export const updateTask = async (taskId, updatedData) => {
    try {
        await instance.put(`/tasks/${taskId}`, updatedData);
    } catch (error) {
        throw error.response?.data || "할 일 수정 실패";
    }
};

export const deleteTask = async (taskId) => {
    try {
        await instance.delete(`/tasks/${taskId}`);
    } catch (error) {
        throw error.response?.data || "할 일 삭제 실패";
    }
};

export const updateTaskOrder = async (taskIds) => {
    try {
        await instance.put("/tasks/order", taskIds);
    } catch (error) {
        throw error.response?.data || "할 일 순서 변경 실패";
    }
};

export const completeTask = async (taskId) => {
    try {
        await instance.put(`/tasks/${taskId}/done`, {});
    } catch (error) {
        throw error.response?.data || "할 일 완료 처리 실패";
    }
};
