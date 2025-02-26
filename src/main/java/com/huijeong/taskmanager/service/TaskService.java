package com.huijeong.taskmanager.service;

import com.huijeong.taskmanager.dto.TaskRequestDto;
import com.huijeong.taskmanager.dto.TaskResponseDto;
import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.repository.TaskRepository;
import com.huijeong.taskmanager.util.TaskStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    // 전체 태스크 조회
    public List<TaskResponseDto> getTasks(User user) {
        return taskRepository.findByUser(user)
                .stream()
                .map(TaskResponseDto::fromEntity)
                .toList();
    }

    // 지난 태스크 목록 조회
    public List<TaskResponseDto> getTaskHistory(int year, int month, int day) {
        LocalDate date = LocalDate.of(year, month, day);
        List<Task> tasks = taskRepository.findByCompletedAtBetween(
                date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        return tasks.stream()
                .map(TaskResponseDto :: fromEntity)
                .collect(Collectors.toList());
    }

    // 새로운 태스크 생성
    public TaskResponseDto createTask(TaskRequestDto request, User user) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setUser(user);
        task.setDueDate(request.getDueDate());

        task = taskRepository.save(task);
        TaskResponseDto response = TaskResponseDto.fromEntity(task);

        messagingTemplate.convertAndSend("/topic/tasks", response);
        notificationService.sendNotification(user.getUserName() + "님이 새로운 할 일을 추가했습니다: " + task.getTitle());

        return response;
    }

    // 태스크 수정
    public TaskResponseDto updateTask(Long id, TaskRequestDto request, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        taskRepository.save(task);
        TaskResponseDto response = TaskResponseDto.fromEntity(task);

        messagingTemplate.convertAndSend("/topic/tasks", response);
        return response;
    }

    // 태스크 순서 변경
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
        messagingTemplate.convertAndSend("/topic/tasks/order", taskIds);
    }

    // 완료된 태스크 조회
    @Transactional
    public TaskResponseDto completeTask(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized");
        }
        task.setStatus(TaskStatus.DONE);
        taskRepository.save(task);

        TaskResponseDto response = TaskResponseDto.fromEntity(task);

        messagingTemplate.convertAndSend("/topic/tasks", response);

        Map<String, String> notification = new HashMap<>();
        notification.put("message", "할 일이 완료되었습니다: " + task.getTitle());

        System.out.println("------------------------->>>> 알림 메시지 전송: " + notification);
        messagingTemplate.convertAndSend("/topic/notifications", notification);

        return response;
    }

    // 태스크 삭제
    public void deleteTask(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized");
        }
        taskRepository.delete(task);
        messagingTemplate.convertAndSend("/topic/tasks/delete", id);
    }
}
