package com.huijeong.taskmanager.service;

import com.huijeong.taskmanager.dto.TaskRequest;
import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.repository.TaskRepository;
import com.huijeong.taskmanager.repository.UserRepository;
import com.huijeong.taskmanager.util.TaskStatus;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

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

        return taskRepository.save(task);
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

        return taskRepository.save(task);
    }

    public void deleteTask (Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        if (!task.getUser().getUserEmail().equals(userEmail)) {
            throw new AccessDeniedException("You are not allowed to delete this task");
        }
        taskRepository.delete(task);
    }
}
