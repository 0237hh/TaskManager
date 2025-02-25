const TaskFilter = ({ filter, onChange }) => {
    return (
        <div style={{padding: "10px", display: "flex", gap: "16px"}}>
            <button
                onClick={() => onChange("all")}
                style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    borderRadius: "6px",
                    backgroundColor: filter === "all" ? "#e4b53a" : "#e0e0e0",
                    color: filter === "all" ? "#fff" : "#000",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    minWidth: "100px"
                }}
            >
                전체
            </button>
            <button
                onClick={() => onChange("done")}
                style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    borderRadius: "6px",
                    backgroundColor: filter === "done" ? "#007bff" : "#e0e0e0",
                    color: filter === "done" ? "#fff" : "#000",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    minWidth: "100px"
                }}
            >
                완료됨
            </button>
            <button
                onClick={() => onChange("in_progress")}
                style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    borderRadius: "6px",
                    backgroundColor: filter === "in_progress" ? "#67a37c" : "#e0e0e0",
                    color: filter === "in_progress" ? "#fff" : "#000",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    minWidth: "100px"
                }}
            >
                진행 중
            </button>
            <button
                onClick={() => onChange("todo")}
                style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    borderRadius: "6px",
                    backgroundColor: filter === "todo" ? "#ff5d5f" : "#e0e0e0",
                    color: filter === "todo" ? "#fff" : "#000",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    minWidth: "100px"
                }}
            >
                대기 중
            </button>
        </div>
    );
};

export default TaskFilter;
