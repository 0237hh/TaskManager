import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="container">
            <h1>Welcome to Task Manager</h1>
            {user ? (
                <p>
                    Hello, {user.username}! Go to your <Link to="/tasks">Task Board</Link>.
                </p>
            ) : (
                <p>
                    <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to start managing your tasks.
                </p>
            )}
        </div>
    );
};

export default Home;
