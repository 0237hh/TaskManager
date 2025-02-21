import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import TaskBoard from "../pages/TaskBoard";
import Profile from "../pages/Profile";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
                <Route path="/tasks" element={<PrivateRoute element={<TaskBoard />} />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
