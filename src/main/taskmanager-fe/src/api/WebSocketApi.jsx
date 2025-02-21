import { Client } from "@stomp/stompjs";

const SOCKET_URL = "ws://localhost:8080/ws";

let client = null;

export const connectWebSocket = (onMessageReceived) => {
    client = new Client({
        brokerURL: SOCKET_URL,
        onConnect: () => {
            console.log("웹소켓 연결 성공");
            client.subscribe("/topic/notifications", (message) => {
                onMessageReceived(JSON.parse(message.body));
            });
        },
        onStompError: (error) => {
            console.error("웹소켓 오류", error);
        },
    });
    client.activate();
};

export const disconnectWebSocket = () => {
    if (client) {
        client.deactivate();
        console.log("웹소켓 연결 해제");
    }
};
