package com.huijeong.taskmanager.service;

import com.huijeong.taskmanager.dto.NotificationMessageDto;
import com.huijeong.taskmanager.dto.TaskRequestDto;
import com.huijeong.taskmanager.dto.TaskResponseDto;
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

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public TaskResponseDto createTask(TaskRequestDto request, User user) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setUser(user);
        task = taskRepository.save(task);

        TaskResponseDto response = TaskResponseDto.fromEntity(task);
        messagingTemplate.convertAndSend("/topic/tasks", response);
        return response;
    }

    public List<Task> getUserTasks(String userEmail) {
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(()-> new UsernameNotFoundException("user not found"));
        return taskRepository.findByUser(user);
    }

    public TaskResponseDto updateTask(Long id, TaskRequestDto request, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());

        TaskResponseDto response = TaskResponseDto.fromEntity(task);
        messagingTemplate.convertAndSend("/topic/tasks", response);
        return response;
    }

    public void deleteTask(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized");
        }

        taskRepository.delete(task);

    }

    public List<TaskResponseDto> getTasks(User user) {
        return taskRepository.findByUser(user)
                .stream()
                .map(TaskResponseDto::fromEntity)
                .toList();
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
                new NotificationMessageDto("할 일이 완료되었습니다: " + task.getTitle()));
    }

    public List<Task> getTasksByDateRange(User user, Date startDate, Date endDate) {
        return taskRepository.findByUserAndCompletedAtBetween(user, startDate, endDate);
    }

    @Transactional
    public void updateTaskOrder(List<Long> taskIds) {
        for (int i = 0; i < taskIds.size(); i++) {
            Task task = taskRepository.findById(taskIds.get(i))
                    .orElseThrow(() -> new RuntimeException("Task not found"));
            task.setOrderIndex(i);
            taskRepository.save(task);
        }
    }

    public List<TaskResponseDto> getTaskHistory(int year, int month, int day) {
        LocalDate date = LocalDate.of(year, month, day);
        List<Task> tasks = taskRepository.findByCompletedAtBetween(
                date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        return tasks.stream()
                .map(TaskResponseDto :: fromEntity)
                .collect(Collectors.toList());
    }
}
