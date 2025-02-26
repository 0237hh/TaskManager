import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SOCKET_URL = "ws://localhost:8080/ws";

let client = null;

export const connectWebSocket = (onNotificationReceived, onTaskUpdate) => {
    client = new Client({
        brokerURL: SOCKET_URL,
        reconnectDelay: 5000,
        debug: (str) => console.log(str),
        onConnect: () => {
            client.subscribe("/topic/notifications", (message) => {
                try {
                    if (!message.body) {
                        console.warn("⚠️ 수신한 메시지가 비어 있음.");
                        return;
                    }
                    const notification = JSON.parse(message.body);
                    if (!notification || !notification.message) {
                        console.warn("⚠️ 잘못된 알림 데이터:", notification);
                        return;
                    }
                    toast.success(notification.message, { position: "top-right" });
                } catch (error) {
                    console.error("❌ 알림 메시지 처리 오류:", error);
                }
            });

            client.subscribe("/topic/tasks", (message) => {
                try {
                    if (!message.body) {
                        console.warn("⚠️ 수신한 메시지가 비어 있음.");
                        return;
                    }
                    const taskUpdate = JSON.parse(message.body);
                    if (!taskUpdate || typeof taskUpdate !== "object" || !taskUpdate.id) {
                        console.warn("⚠️ 잘못된 태스크 데이터:", taskUpdate);
                        return;
                    }
                    onTaskUpdate(taskUpdate);

                } catch (error) {
                    console.error("❌ 태스크 메시지 처리 오류:", error);
                }
            });
        },
        onStompError: (error) => {
            console.error("❌ WebSocket 오류 발생:", error);
        },
        onDisconnect: () => {
            console.log("⚠️ WebSocket 연결이 종료되었습니다.");
        }
    });

    client.activate();
};

export const disconnectWebSocket = () => {
    if (client) {
        client.deactivate();
        console.log("⚠️ WebSocket 연결 해제");
    }
};
