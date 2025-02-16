import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onUpdate, onDelete }) => {
    return (
        <div className="space-y-2">
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <TaskItem key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
                ))
            ) : (
                <p className="text-gray-500">할 일이 없습니다.</p>
            )}
        </div>
    );
};

export default TaskList;
