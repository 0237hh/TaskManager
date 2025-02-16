import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useTasks from "../hooks/useTasks";
import TaskItem from "../components/Task/TaskItem";

const TaskBoard = () => {
    const { tasks, updateExistingTask } = useTasks();
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        setTaskList(tasks);
    }, [tasks]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newTaskList = Array.from(taskList);
        const [reorderedTask] = newTaskList.splice(result.source.index, 1);
        newTaskList.splice(result.destination.index, 0, reorderedTask);

        setTaskList(newTaskList);
        updateExistingTask(reorderedTask.id, { ...reorderedTask, order: result.destination.index });
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {taskList.map((task, index) => (
                            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <TaskItem task={task} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default TaskBoard;
