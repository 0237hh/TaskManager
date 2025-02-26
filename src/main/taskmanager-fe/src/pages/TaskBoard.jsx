import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "../styles/TaskBoard.css"
import useTasks from "../hooks/useTasks";
import TaskFilter from "../components/Task/TaskFilter";
import TaskForm from "../components/Task/TaskForm";
import TaskList from "../components/Task/TaskList";
import useWebSocket from "../hooks/useWebSocket.jsx";
import Notification from "../components/common/Notification.jsx";

const TaskBoard = () => {
    const { tasks, updateExistingTask, deleteTask } = useTasks();
    const [taskList, setTaskList] = useState(tasks);
    const [filter, setFilter] = useState("all");

    const { messages, notification } = useWebSocket();

    useEffect(() => {
        if (taskList.length === 0) {
            setTaskList(tasks);
        }
    }, [tasks]);

    useEffect(() => {
        if (messages.length > 0) {
            const newMessage = messages[messages.length - 1];

            if (newMessage.action === "updateTask") {
                setTaskList((prev) =>
                    prev.map(task =>
                        task.id === newMessage.taskId
                            ? { ...task, status: newMessage.status }
                            : task
                    )
                );
            }
        }
    }, [messages]);

    const handleAddTask = (newTask) => {
        setTaskList((prev) => [...prev, newTask]);
    };

    const handleUpdateTask = (taskId, newTitle, newStatus) => {
        const mappedStatus = newStatus === "COMPLETED" ? "DONE" : newStatus === "PENDING" ? "TODO" : newStatus;

        setTaskList((prev) =>
            prev.map(task => task.id === taskId ? { ...task, title: newTitle, status: mappedStatus } : task)
        );

        updateExistingTask(taskId, { title: newTitle, status: mappedStatus });
    };

    const handleDeleteTask = (taskId) => {
        setTaskList((prev) => prev.filter(task => task.id !== taskId));
        deleteTask(taskId);
    };

    const filteredTasks = taskList.filter(task =>
        filter === "all"
            ? true
            : filter === "completed"
                ? task.status === "DONE"
                : filter === "todo"
                    ? task.status === "TODO"
                    : task.status === "IN_PROGRESS"
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
        <div className="task-board-container">
            <div className="task-board">
                <h1 className="task-board-title">📌 Task Board</h1>

                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}

                <div className="task-form-container">
                    <TaskForm onAdd={handleAddTask} />
                </div>

                <div className="task-filter-container">
                    <TaskFilter filter={filter} onChange={setFilter} />
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="tasks">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="task-list-container">
                                <TaskList
                                    tasks={filteredTasks}
                                    onUpdate={handleUpdateTask}
                                    onDelete={handleDeleteTask}
                                />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default TaskBoard;
