import { useState } from "react";
import { login } from "../../api/authApi";

const LoginForm = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(email, password);
            onLoginSuccess(userData);
        } catch (err) {
            setError(err.message || "로그인 실패");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md">
            <h2 className="text-lg font-semibold mb-2">로그인</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                required
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                required
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                로그인
            </button>
        </form>
    );
};

export default LoginForm;
