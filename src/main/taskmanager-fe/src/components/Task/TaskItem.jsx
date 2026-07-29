import { useState } from "react";
import { updateTask, deleteTask } from "../../api/taskApi";
import TaskCard from "./TaskCard";

const TaskItem = ({ task, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const [newStatus, setNewStatus] = useState(task.status);
    const [newDueDate, setNewDueDate] = useState(task.dueDate || ""); 

    const handleUpdate = async () => {
        try {
            await updateTask(task.id, {
                title: newTitle,
                status: newStatus,
                dueDate: newDueDate || null,  
            });
            onUpdate(task.id, newTitle, newStatus, newDueDate); 
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
        <TaskCard
            task={task}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newStatus={newStatus}
            setNewStatus={setNewStatus}
            newDueDate={newDueDate}           
            setNewDueDate={setNewDueDate}      
            onUpdate={handleUpdate}
            onDelete={handleDelete}
        />
    );
};

export default TaskItem;