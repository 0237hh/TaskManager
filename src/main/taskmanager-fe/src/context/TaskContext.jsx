import { createContext, useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const data = await getTasks();
        setTasks(data);
    };

    const addNewTask = async (task) => {
        const newTask = await createTask(task);
        setTasks([...tasks, newTask]);
    };

    const updateExistingTask = async (taskId, updatedTask) => {
        const updated = await updateTask(taskId, updatedTask);
        setTasks(tasks.map(task => task.id === taskId ? updated : task));
    };

    const removeTask = async (taskId) => {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    return (
        <TaskContext.Provider value={{ tasks, addNewTask, updateExistingTask, removeTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export {TaskContext, TaskProvider};