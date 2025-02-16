const TaskFilter = ({ filter, onChange }) => {
    return (
        <div className="p-2 flex gap-2">
            <button
                onClick={() => onChange("all")}
                className={`p-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
                전체
            </button>
            <button
                onClick={() => onChange("completed")}
                className={`p-2 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
                완료됨
            </button>
            <button
                onClick={() => onChange("pending")}
                className={`p-2 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
                미완료
            </button>
        </div>
    );
};

export default TaskFilter;
