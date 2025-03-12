import { useContext } from "react";
import { TaskContext } from "../context/TaskContext.jsx";

const useTasks = () => {
    return useContext(TaskContext);
};

export default useTasks;
