import { useEffect, useState } from "react";
import { connectWebSocket, disconnectWebSocket } from "../api/websocketApi";

const useWebSocket = () => {
    const [messages, setMessages] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        connectWebSocket(
            (notificationMessage) => {
                setNotification({
                    message: notificationMessage.message,
                    type: "info",
                });
                setTimeout(() => setNotification(null), 3000);
            },
            (taskUpdate) => {
                setMessages((prev) => [...prev, taskUpdate]);
            }
        );
        return () => {
            disconnectWebSocket();
        };
    }, []);

    return { messages, notification };
};

export default useWebSocket;
