import { Draggable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onUpdate, onDelete }) => {
    return (
        <div className="task-list-container">
            {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                             className="task-item-container">
                            <TaskItem
                                task={task}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                            />
                        </div>
                    )}
                </Draggable>
            ))}
        </div>
    );
};

export default TaskList;
