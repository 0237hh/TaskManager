import React from "react";
import { Card, Typography, IconButton, TextField, Select, MenuItem, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { format } from "date-fns";

export default function TaskCard({
    task, isEditing, setIsEditing,
    newTitle, setNewTitle,
    newStatus, setNewStatus,
    newDueDate, setNewDueDate,
    onUpdate, onDelete
}) {
    return (
        <Card
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
            }}
        >
            {isEditing ? (
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 1 }}>
                    <TextField fullWidth value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                    <Select fullWidth value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                        <MenuItem value="IN_PROGRESS">진행 중</MenuItem>
                        <MenuItem value="DONE">완료됨</MenuItem>
                        <MenuItem value="TODO">대기 중</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        type="date"
                        label="마감기한"
                        InputLabelProps={{ shrink: true }}
                        value={newDueDate || ""}
                        onChange={(e) => setNewDueDate(e.target.value)}
                    />
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{task.status}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        생성 날짜: {task.createdAt ? format(new Date(task.createdAt), "yyyy-MM-dd HH:mm") : "N/A"}
                    </Typography>
                    {task.dueDate && (
                        <Typography variant="caption" color="text.secondary">
                            마감기한: {task.dueDate}
                        </Typography>
                    )}
                    {task.completedAt && (
                        <Typography variant="caption" color="text.secondary">
                            완료 날짜: {format(new Date(task.completedAt), "yyyy-MM-dd HH:mm")}
                        </Typography>
                    )}
                </Box>
            )}

            <Box sx={{ display: "flex", gap: 1 }}>
                {isEditing ? (
                    <IconButton onClick={onUpdate} sx={{ color: '#2196f3' }} aria-label="save">
                        <SaveIcon />
                    </IconButton>
                ) : (
                    <IconButton onClick={() => setIsEditing(true)} aria-label="edit" sx={{ color: '#9c27b0' }}>
                        <EditIcon />
                    </IconButton>
                )}
                <IconButton onClick={onDelete} aria-label="delete" sx={{ color: '#e91e63' }}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Card>
    );
}