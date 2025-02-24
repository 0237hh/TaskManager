// TaskCard.js
import React from "react";
import { Card, CardHeader, CardContent, CardActions, Typography, IconButton, TextField, Select, MenuItem, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

export default function TaskCard({ task, isEditing, setIsEditing, newTitle, setNewTitle, newStatus, setNewStatus, onUpdate, onDelete }) {
    return (
        <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
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
                    <Button onClick={onUpdate} variant="contained" color="primary" startIcon={<SaveIcon />}>
                        저장
                    </Button>
                ) : (
                    <IconButton onClick={() => setIsEditing(true)} aria-label="edit">
                        <EditIcon />
                    </IconButton>
                )}
                <IconButton onClick={onDelete} aria-label="delete">
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
