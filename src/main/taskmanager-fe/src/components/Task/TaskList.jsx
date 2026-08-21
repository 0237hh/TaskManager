import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "./TaskItem";

const SortableTaskItem = ({ task, onUpdate, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: task.id.toString() });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="task-item-container"
        >
            <TaskItem task={task} onUpdate={onUpdate} onDelete={onDelete} />
        </div>
    );
};

const TaskList = ({ tasks, onUpdate, onDelete, onDragEnd }) => {
    // 마우스가 8px 이상 움직여야 드래그로 인식 → 클릭(수정/삭제 버튼)과 드래그를 구분해줌
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
                items={tasks.map((t) => t.id.toString())}
                strategy={rectSortingStrategy}
            >
                <div className="task-list-container">
                    {tasks.map((task) => (
                        <SortableTaskItem
                            key={task.id}
                            task={task}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default TaskList;