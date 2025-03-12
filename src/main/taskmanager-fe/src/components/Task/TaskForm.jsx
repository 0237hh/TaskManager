import { useState } from "react";
import { createTask } from "../../api/taskApi";
import "../../styles/TaskForm.css";

const TaskForm = ({ onAdd }) => {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("IN_PROGRESS");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const newTask = await createTask({ title, status });
            onAdd(newTask);
            setTitle("");
            setStatus("IN_PROGRESS");
        } catch (err) {
            console.error("할 일 추가 실패:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="할 일을 입력하세요"
                className="task-input"
                required
            />
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="task-select"
            >
                <option value="IN_PROGRESS">진행 중</option>
                <option value="DONE">완료됨</option>
                <option value="TODO">대기 중</option>
            </select>
            <button type="submit" className="task-submit-btn">
                추가
            </button>
        </form>
    );
};

export default TaskForm;
