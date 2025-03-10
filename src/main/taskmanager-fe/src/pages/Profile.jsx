import { useState } from "react";
import useAuth from "../hooks/useAuth";
import Modal from "../components/common/Modal.jsx";
import Avatar from "@mui/material/Avatar";

const Profile = () => {
    const { user, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user) return <p>Loading...</p>;

    const handleProfileClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Avatar
                sx={{ bgcolor: "#8ba7ff", cursor: "pointer" }}
                onClick={handleProfileClick}
            >
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </Avatar>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="My Info">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </Modal>
        </div>
    );
};

export default Profile;
