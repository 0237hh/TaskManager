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
                    if (!message.body) { return; }
                    const notification = JSON.parse(message.body);
                    if (!notification || !notification.message) { return; }
                    toast.success(notification.message, { position: "top-right" });
                } catch (error) {}
            });

            client.subscribe("/topic/tasks", (message) => {
                try {
                    if (!message.body) { return; }
                    const taskUpdate = JSON.parse(message.body);
                    if (!taskUpdate || typeof taskUpdate !== "object" || !taskUpdate.id) { return; }
                    onTaskUpdate(taskUpdate);
                } catch (error) { }
            });
        },
        onStompError: (error) => {},
        onDisconnect: () => {}
    });

    client.activate();
};

export const disconnectWebSocket = () => {
    if (client) {
        client.deactivate();
    }
};
