import { useState } from "react";
import { createTask } from "../../api/taskApi";

const TaskForm = ({ onAdd }) => {
    const [title, setTitle] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const newTask = await createTask({ title });
            onAdd(newTask);
            setTitle("");
        } catch (err) {
            console.error("할 일 추가 실패:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 border rounded shadow-md flex gap-2">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="할 일을 입력하세요"
                className="border p-2 rounded flex-1"
                required
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded">
                추가
            </button>
        </form>
    );
};

export default TaskForm;
