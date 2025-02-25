// TaskCard.js
import React from "react";
import { Card, CardHeader, CardContent, CardActions, Typography, IconButton, TextField, Select, MenuItem, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

export default function TaskCard({ task, isEditing, setIsEditing, newTitle, setNewTitle, newStatus, setNewStatus, onUpdate, onDelete }) {
    return (
        <Card sx={{ width: "100%", minWidth: 200, marginBottom: 2 }}>
            <CardHeader title={isEditing ? "수정 중" : task.title} subheader={task.status} />
            <CardContent>
                {isEditing ? (
                    <>
                        <TextField fullWidth value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                        <Select fullWidth value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                            <MenuItem value="IN_PROGRESS">진행 중</MenuItem>
                            <MenuItem value="DONE">완료됨</MenuItem>
                            <MenuItem value="TODO">대기 중</MenuItem>
                        </Select>
                    </>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        {task.description}
                    </Typography>
                )}
            </CardContent>
            <CardActions disableSpacing>
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
            </CardActions>
        </Card>
    );
}
