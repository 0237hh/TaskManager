import { useState } from "react";
import useAuth from "../hooks/useAuth";
import Modal from "../components/common/Modal.jsx";
import Avatar from "@mui/material/Avatar";
import { TextField, Button } from "@mui/material";
import { updateUser } from "../api/authApi";

const Profile = () => {
    const { user, logout, setUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [error, setError] = useState("");

    if (!user) return <p>Loading...</p>;

    const handleProfileClick = () => {
        setNewUsername(user.userName);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setError("");
    };

    const handleSave = async () => {
        try {
            const updated = await updateUser(newUsername);
            setUser((prev) => ({ ...prev, userName: updated.userName }));
            setIsEditing(false);
        } catch (err) {
            setError(typeof err === "string" ? err : "수정에 실패했습니다.");
        }
    };

    return (
        <div>
            <Avatar
                sx={{ bgcolor: "#8ba7ff", cursor: "pointer" }}
                onClick={handleProfileClick}
            >
                {user.userName ? user.userName.charAt(0).toUpperCase() : "U"}
            </Avatar>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="My Info">
                {isEditing ? (
                    <>
                        <TextField
                            fullWidth
                            label="사용자 이름"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        />
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <Button variant="contained" onClick={handleSave} sx={{ marginRight: 1 }}>
                            저장
                        </Button>
                        <Button onClick={() => setIsEditing(false)}>취소</Button>
                    </>
                ) : (
                    <>
                        <p><strong>Username:</strong> {user.userName}</p>
                        <p><strong>Email:</strong> {user.userEmail}</p>
                        <Button variant="outlined" onClick={() => setIsEditing(true)}>
                            수정하기
                        </Button>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Profile;