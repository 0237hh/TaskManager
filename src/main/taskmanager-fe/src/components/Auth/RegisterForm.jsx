import { useState } from "react";
import { register } from "../../api/authApi";

const RegisterForm = ({ onRegisterSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await register(email, password, username);
            onRegisterSuccess(userData);
        } catch (err) {
            setError(err.message || "회원가입 실패");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md">
            <h2 className="text-lg font-semibold mb-2">회원가입</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
                type="text"
                placeholder="이름"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                required
            />
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
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
                회원가입
            </button>
        </form>
    );
};

export default RegisterForm;
