import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onUpdate, onDelete }) => {
    return (
        <div>
            {tasks.map((task, index) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    index={index}  // Drag & Drop을 위해 필요
                />
            ))}
        </div>
    );
};

export default TaskList;
