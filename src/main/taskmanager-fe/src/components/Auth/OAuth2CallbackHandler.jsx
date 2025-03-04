import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCurrentUser } from "../../api/authApi.jsx"
import { instance } from "../../config/axiosConfig";

const OAuth2CallbackHandler = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        const handleOAuthLogin = async () => {
            if (!token) {
                console.error('토큰 없음');
                navigate('/login');
                return;
            }

            try {
                localStorage.setItem("token", token);
                instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                const userInfo = await getCurrentUser();

                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                console.log("구글 로그인 성공! 사용자 정보:", userInfo);

                navigate('/tasks');
            } catch (error) {
                console.error('구글 로그인 후 사용자 정보 조회 실패:', error);
                navigate('/login');
            }
        };
        handleOAuthLogin();
    }, [navigate, searchParams]);

    return (
        <div>
            <p>OAuth2 로그인 처리 중...</p>
        </div>
    );
};

export default OAuth2CallbackHandler;
