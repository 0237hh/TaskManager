export const getUserFromToken = (token) => {
    try {
        const base64Url = token.split(".")[1]; // JWT payload 부분 추출
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};
