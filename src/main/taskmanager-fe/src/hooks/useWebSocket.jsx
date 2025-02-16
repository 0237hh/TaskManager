import { useEffect, useState } from "react";
import { connectWebSocket } from "../api/websocketApi.jsx";

const useWebSocket = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const ws = connectWebSocket();

        ws.onmessage = (event) => {
            setMessages((prev) => [...prev, JSON.parse(event.data)]);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = (message) => {
        if (socket) {
            socket.send(JSON.stringify(message));
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;
