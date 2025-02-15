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
    }

    // 완료된 태스크 조회
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

    // 태스크 삭제
    public void deleteTask(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized");
        }
        taskRepository.delete(task);
    }
}
