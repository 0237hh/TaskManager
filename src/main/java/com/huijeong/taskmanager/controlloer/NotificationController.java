package com.huijeong.taskmanager.controlloer;

import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.repository.TaskRepository;
import com.huijeong.taskmanager.util.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequiredArgsConstructor
public class NotificationController {
    private final SimpMessagingTemplate messagingTemplate;
    private final TaskRepository taskRepository;

    @PostMapping("/api/tasks/{taskId}/complete")
    public ResponseEntity<?> completeTask(@PathVariable Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(TaskStatus.COMPLETE);
        task.setCompletedAt(new Date());
        taskRepository.save(task);

        messagingTemplate.convertAndSend("/topic/notifications",
                "할 일 '" + task.getTitle() + "'이(가) 완료되었습니다!");

        return ResponseEntity.ok("Task completed");
    }
}
