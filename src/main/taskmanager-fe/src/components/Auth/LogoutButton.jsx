import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';

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
        <IconButton
            onClick={handleLogout}
            color="error"
            style={{
                padding: "10px",
            }}
        >
            <LogoutIcon />
        </IconButton>
    );
};

export default LogoutButton;
