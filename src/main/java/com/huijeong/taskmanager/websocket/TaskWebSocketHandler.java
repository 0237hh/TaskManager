package com.huijeong.taskmanager.websocket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TaskWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        UserDetails user = (UserDetails) session.getAttributes().get("user");
        if (user != null) {
            sessions.put(user.getUsername(), session);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(message.getPayload());
        String action = jsonNode.get("action").asText();

        if ("updateTask".equals(action)) {
            String taskId = jsonNode.get("taskId").asText();
            String newStatus = jsonNode.get("status").asText();

            // 할 일 상태 업데이트 (DB 저장 로직 추가 가능)
            broadcastMessage("Task " + taskId + " updated to " + newStatus);
        }
    }

    private void broadcastMessage(String message) throws IOException {
        for (WebSocketSession session : sessions.values()) {
            session.sendMessage(new TextMessage(message));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.values().remove(session);
    }
}
