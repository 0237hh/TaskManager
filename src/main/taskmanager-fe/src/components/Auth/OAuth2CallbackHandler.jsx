import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuth2CallbackHandler = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate('/tasks');
        } else {
            console.error('토큰 없음');
            navigate('/login');
        }
    }, [navigate, searchParams]);

    return (
        <div>
            <p>OAuth2 로그인 처리 중...</p>
        </div>
    );
};

export default OAuth2CallbackHandler;
