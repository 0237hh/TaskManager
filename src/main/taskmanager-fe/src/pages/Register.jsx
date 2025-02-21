import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";

const Register = () => {
    const [userInfo, setUserInfo] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(userInfo.email, userInfo.password, userInfo.username);
            navigate("/login");  // ✅ 회원가입 후 로그인 페이지로 이동
        } catch (err) {
            console.error("❌ [Register] 회원가입 실패:", err);
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required/>
                <br></br>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
                <br></br>
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
                <br></br>
                <button type="submit">Register</button>
                <br></br>
            </form>
        </div>
    );
};

export default Register;