import { useEffect, useState } from "react";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import useTasks from "../hooks/useTasks";
import TaskFilter from "../components/Task/TaskFilter";
import TaskForm from "../components/Task/TaskForm";
import TaskList from "../components/Task/TaskList";

const TaskBoard = () => {
    const { tasks, updateExistingTask } = useTasks();
    const [taskList, setTaskList] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        setTaskList(tasks);
    }, [tasks]);

    const handleAddTask = (newTask) => {
        setTaskList([...taskList, newTask]);
    };

    const handleUpdateTask = (taskId, newTitle, newStatus) => {
        setTaskList(taskList.map(task => task.id === taskId ? { ...task, title: newTitle, status: newStatus } : task));
    };

    const handleDeleteTask = (taskId) => {
        setTaskList(taskList.filter(task => task.id !== taskId));
    };

    const filteredTasks = taskList.filter(task =>
        filter === "all"
            ? true
            : filter === "completed"
                ? task.status === "COMPLETED"
                : task.status === "IN_PROGRESS" || task.status === "PENDING"
    );

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newTaskList = [...taskList];
        const [reorderedTask] = newTaskList.splice(result.source.index, 1);
        newTaskList.splice(result.destination.index, 0, reorderedTask);

        setTaskList(newTaskList);
        updateExistingTask(reorderedTask.id, { ...reorderedTask, order: result.destination.index });
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold">Task Board</h1>
            <TaskForm onAdd={handleAddTask} />
            <TaskFilter filter={filter} onChange={setFilter} />

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <TaskList tasks={filteredTasks} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default TaskBoard;
