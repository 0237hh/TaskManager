import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (typeof logout === "function") {
            logout();
            navigate("/login");
        } else {
            console.error("logout 함수가 존재하지 않습니다!");
        }
    };

    return (
        <button onClick={handleLogout}
                style={{
                    padding: "14px",
                    fontSize: "16px",
                    cursor: "pointer",
                    backgroundColor: '#8ba7ff',
                    color: "white",
                    borderRadius: "5px",
                    fontWeight: "bold",
                }}>
            로그아웃
        </button>
    );
};

export default LogoutButton;
