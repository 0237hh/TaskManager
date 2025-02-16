import { useNavigate } from "react-router-dom";

const LogoutButton = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        onLogout();
        navigate("/login");
    };

    return (
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
            로그아웃
        </button>
    );
};

export default LogoutButton;
