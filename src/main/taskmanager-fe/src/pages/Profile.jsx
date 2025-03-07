import { useState } from "react";
import useAuth from "../hooks/useAuth";
import Modal from "../components/common/Modal.jsx";

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
        <div className="container">
            <h2>Profile</h2>
            <button onClick={handleProfileClick} className="bg-blue-500 text-white p-2 rounded">
                유저 프로필 보기
            </button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="유저 프로필">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
                    로그아웃
                </button>
            </Modal>
        </div>
    );
};

export default Profile;
