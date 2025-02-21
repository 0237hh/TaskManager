import { useState } from "react";
import { updateTask, deleteTask } from "../../api/taskApi";

const TaskItem = ({ task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const [newStatus, setNewStatus] = useState(task.status);  // ✅ 상태 추가

    const handleUpdate = async () => {
        try {
            await updateTask(task.id, { title: newTitle, status: newStatus });  // ✅ status 포함
            onUpdate(task.id, newTitle, newStatus);
            setIsEditing(false);
        } catch (err) {
            console.error("업데이트 실패:", err);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTask(task.id);
            onDelete(task.id);
        } catch (err) {
            console.error("삭제 실패:", err);
        }
    };

    return (
        <div className="p-3 border rounded shadow-md flex justify-between items-center">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="border p-1 rounded"
                    />
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="border p-1 rounded"
                    >
                        <option value="IN_PROGRESS">진행 중</option>
                        <option value="COMPLETED">완료됨</option>
                        <option value="PENDING">대기 중</option>
                    </select>
                </>
            ) : (
                <>
                    <span>{task.title} ({task.status})</span>
                </>
            )}
            <div className="flex gap-2">
                {isEditing ? (
                    <button onClick={handleUpdate} className="bg-blue-500 text-white p-1 rounded">
                        저장
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white p-1 rounded">
                        수정
                    </button>
                )}
                <button onClick={handleDelete} className="bg-red-500 text-white p-1 rounded">
                    삭제
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
