import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import { IconButton, Tooltip } from "@mui/material";  
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; 
import "../styles/TaskBoard.css";
import useTasks from "../hooks/useTasks";
import TaskFilter from "../components/Task/TaskFilter";
import TaskForm from "../components/Task/TaskForm";
import TaskList from "../components/Task/TaskList";
import useWebSocket from "../hooks/useWebSocket.jsx";
import Notification from "../components/common/Notification.jsx";
import LogoutButton from "../components/Auth/LogoutButton.jsx";
import Profile from "./Profile.jsx";
import CalendarView from "./CalendarView.jsx"; 

const TaskBoard = () => {
  const navigate = useNavigate(); 
  const { tasks, updateExistingTask, deleteTask } = useTasks();
  const [taskList, setTaskList] = useState(tasks);
  const [filter, setFilter] = useState("all");
  const { messages, notification, setNotification } = useWebSocket();
  const [calendarOpen, setCalendarOpen] = useState(false);
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
          prev.map((task) =>
            task.id === newMessage.taskId
              ? { ...task, status: newMessage.status }
              : task,
          ),
        );
      }
    }
  }, [messages]);

  const handleAddTask = (newTask) => {
    setTaskList((prev) => [...prev, newTask]);
  };

  const handleUpdateTask = (taskId, newTitle, newStatus) => {
    const mappedStatus =
      newStatus === "COMPLETED"
        ? "DONE"
        : newStatus === "PENDING"
          ? "TODO"
          : newStatus;

    setTaskList((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, title: newTitle, status: mappedStatus }
          : task,
      ),
    );

    updateExistingTask(taskId, { title: newTitle, status: mappedStatus });
  };

  const handleDeleteTask = (taskId) => {
    setTaskList((prev) => prev.filter((task) => task.id !== taskId));
    deleteTask(taskId);
  };

  const filteredTasks = taskList.filter((task) =>
    filter === "all"
      ? true
      : filter === "done"
        ? task.status === "DONE"
        : filter === "todo"
          ? task.status === "TODO"
          : filter === "in_progress"
            ? task.status === "IN_PROGRESS"
            : false,
  );

const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const sourceTask = filteredTasks.find((t) => t.id.toString() === active.id);
  const destTask = filteredTasks.find((t) => t.id.toString() === over.id);
  if (!sourceTask || !destTask) return;

  const newTaskList = [...taskList];
  const actualSourceIndex = newTaskList.findIndex((t) => t.id === sourceTask.id);
  const actualDestIndex = newTaskList.findIndex((t) => t.id === destTask.id);

  const [reorderedTask] = newTaskList.splice(actualSourceIndex, 1);
  newTaskList.splice(actualDestIndex, 0, reorderedTask);

  setTaskList(newTaskList);
  updateExistingTask(reorderedTask.id, {
      ...reorderedTask,
      order: actualDestIndex,
  });
};

  return (
    <div className="task-board-container">
      <div className="task-board">
        <div className="header-container">
          <h1 className="task-board-title">📌 Task Board</h1>
          <div className="logout-profile-container">
            <Tooltip title="캘린더 보기">
              <IconButton onClick={() => setCalendarOpen(true)} sx={{ color: '#1976d2' }}>
                <CalendarMonthIcon />
              </IconButton>
            </Tooltip>
            <LogoutButton onLogout={() => navigate("/login")} />
            <Profile />
          </div>
        </div>

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

        <TaskList
          tasks={filteredTasks}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          onDragEnd={handleDragEnd}
        />
      </div>
      <CalendarView open={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </div>
  );
};

export default TaskBoard;
