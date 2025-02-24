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
            navigate("/login");
        } catch (err) {
            console.error("❌ [Register] 회원가입 실패:", err);
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>REGISTER</h2>
            {error && <p className="error" style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <li>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "12px", fontSize: "18px", borderRadius: "5px", border: "1px solid #ccc" }}
                        />
                    </li>
                    <li>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "12px", fontSize: "18px", borderRadius: "5px", border: "1px solid #ccc" }}
                        />
                    </li>
                    <li>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "12px", fontSize: "18px", borderRadius: "5px", border: "1px solid #ccc" }}
                        />
                    </li>
                </ul>
                <button type="submit" style={{ padding: "14px", fontSize: "20px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>Register</button>
            </form>
        </div>
    );
};

export default Register;