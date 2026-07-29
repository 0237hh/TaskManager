import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useContext } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TaskContext } from "../context/TaskContext.jsx";

const STATUS_COLORS = {
  DONE: "#007bff",
  IN_PROGRESS: "#67a37c",
  TODO: "#ff5d5f",
};

const CalendarView = ({ open, onClose }) => {
  const { tasks } = useContext(TaskContext);

  const events = tasks
    .filter(Boolean)   // ← 방어 코드: undefined 항목 있어도 안전하게
    .map((t) => ({
      title: t.title,
      date: t.dueDate || t.createdAt?.split("T")[0],
      backgroundColor: STATUS_COLORS[t.status] || "#9e9e9e",
      borderColor: STATUS_COLORS[t.status] || "#9e9e9e",
    }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        캘린더
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CalendarView;