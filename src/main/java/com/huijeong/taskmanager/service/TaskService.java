package com.huijeong.taskmanager.service;

import com.huijeong.taskmanager.dto.NotificationMessage;
import com.huijeong.taskmanager.dto.TaskRequest;
import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.repository.TaskRepository;
import com.huijeong.taskmanager.repository.UserRepository;
import com.huijeong.taskmanager.util.TaskStatus;
import com.huijeong.taskmanager.websocket.TaskUpdateMessage;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Task createTask(TaskRequest request, String userEmail) {
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("user not found"));

        Task task = Task.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getTitle())
                .status(TaskStatus.TODO)
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .build();

        // WebSocket으로 새 할 일 생성 알림 전송
        Task savedTask = taskRepository.save(task);
        messagingTemplate.convertAndSend("topic/tasks",
                new TaskUpdateMessage(savedTask.getTaskId(), "CREATE", savedTask));
        return savedTask;
    }

    public List<Task> getUserTasks(String userEmail) {
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(()-> new UsernameNotFoundException("user not found"));
        return taskRepository.findByUser(user);
    }

    public Task updateTask (Long taskId, TaskRequest request, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("task not found"));

        if (!task.getUser().getUserEmail().equals(userEmail)) {
            throw new UsernameNotFoundException("user not found");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        // WebSocket으로 할 일 수정 알림 전송
        Task updatedTask = taskRepository.save(task);
        messagingTemplate.convertAndSend("topic/tasks",
                new TaskUpdateMessage(updatedTask.getTaskId(), "UPDATE", updatedTask));

        return updatedTask;
    }

    public void deleteTask (Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        if (!task.getUser().getUserEmail().equals(userEmail)) {
            throw new AccessDeniedException("You are not allowed to delete this task");
        }
        taskRepository.delete(task);

        // WebSocket 으로 할일 삭제 알림 전송
        messagingTemplate.convertAndSend("/topic/tasks",
                new TaskUpdateMessage(taskId, "DELETE", null));
    }

    @Transactional
    public void updateTaskOrder(List<Long> taskIds, User user) {
        int priority = 1;
        for (Long taskId : taskIds) {
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            if (!task.getUser().equals(user)) {
                throw new RuntimeException("Unauthorized");
            }

            task.setPriority(priority++);
        }
    }

    @Transactional
    public void completeTask(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized");
        }
        task.setStatus(TaskStatus.DONE);
        taskRepository.save(task);

        // WebSocket을 이용해 모든 사용자에게 알림 전송
        messagingTemplate.convertAndSend("/topic/notifications",
                new NotificationMessage("할 일이 완료되었습니다: " + task.getTitle()));
    }

    public List<Task> getTasksByDateRange(User user, Date startDate, Date endDate) {
        return taskRepository.findByUserAndCompletedAtBetween(user, startDate, endDate);
    }

    @Transactional
    public void updateTaskOrder (List<Long> taskIds) {
        for (int i = 0; i < taskIds.size(); i++) {
            Task task = taskRepository.findById(taskIds.get(i))
                    .orElseThrow(() -> new RuntimeException("Task not found"));
            task.setOrderIndex(i);
            taskRepository.save(task);
        }
    }
}
