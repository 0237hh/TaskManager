import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import GoogleLoginButton from "../components/Auth/GoogleLoginButton.jsx";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(credentials.email, credentials.password);
            if (response && response.token) {
                localStorage.setItem("token", response.token);
                alert("로그인 성공!");
                navigate("/tasks");
            } else {
                alert("로그인 실패!");
                throw new Error("Token이 반환되지 않았습니다.");
            }
        } catch (err) {
            console.error("로그인 실패:", err);
            setError("Invalid email or password");
        }
    };

    return (
        <div className="container" style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>LOGIN</h2>
            {error && <p className="error" style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <li>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={credentials.email}
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
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            style={{ width: "100%", padding: "12px", fontSize: "18px", borderRadius: "5px", border: "1px solid #ccc" }}
                        />
                    </li>
                </ul>
                <button type="submit" style={{ padding: "14px", fontSize: "20px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>Login</button>
            </form>
            <div style={{ marginTop: "20px" }}>
                <p>계정이 없나요?</p>
                <button onClick={() => navigate("/register")} style={{ backgroundColor: "#28a745", color: "white", padding: "12px", fontSize: "18px", borderRadius: "5px", border: "none", cursor: "pointer" }}>
                    회원가입하러가기!
                </button>
            </div>
            <div style={{ marginTop: "20px" }}>
                <p>또는</p>
                <GoogleLoginButton />
            </div>
        </div>
    );
};

export default Login;
