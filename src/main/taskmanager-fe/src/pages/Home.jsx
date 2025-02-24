import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="container" style={{ textAlign: "center", padding: "70px", maxWidth: "600px", margin: "0 auto", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
            <h1>Welcome to Task Manager</h1>
            {user ? (
                <p>
                    Hello, {user.username}! Go to your <Link to="/tasks">Task Board</Link>.
                </p>
            ) : (
                <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                    <Link to="/login" style={{ padding: "14px 24px", fontSize: "20px", backgroundColor: "#007bff", color: "white", borderRadius: "8px", textDecoration: "none" }}>Login</Link>
                    <Link to="/register" style={{ padding: "14px 24px", fontSize: "20px", backgroundColor: "#28a745", color: "white", borderRadius: "8px", textDecoration: "none" }}>Register</Link>
                </div>
            )}
        </div>
    );
};

export default Home;
