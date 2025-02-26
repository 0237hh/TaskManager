package com.huijeong.taskmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.repository.TaskRepository;
import com.huijeong.taskmanager.util.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final SimpMessagingTemplate messagingTemplate;
    private final TaskRepository taskRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/tasks/{taskId}/complete")
    public ResponseEntity<?> completeTask(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(TaskStatus.DONE);
        task.setCompletedAt(new Date());
        taskRepository.save(task);

        // JSON 형식의 알림 메시지 생성
        Map<String, String> notification = new HashMap<>();
        notification.put("message", "할 일 '" + task.getTitle() + "'이(가) 완료되었습니다!");

        try {
            String jsonNotification = objectMapper.writeValueAsString(notification);
            messagingTemplate.convertAndSend("/topic/notifications", jsonNotification);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("알림 전송 중 오류 발생");
        }
        return ResponseEntity.ok("Task completed");
    }
}
