package com.huijeong.taskmanager.dto;

import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.util.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private String userEmail;
    private LocalDateTime createAt;
    private LocalDateTime completeAt;
    private LocalDate dueDate;

    public static TaskResponseDto fromEntity(Task task) {
        return new TaskResponseDto(
                task.getTaskId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getUser().getUserEmail(),
                task.getCreateAt(),
                task.getCompletedAt() != null ? task.getCompletedAt().toInstant()
                        .atZone(java.time.ZoneId.systemDefault()).toLocalDateTime() : null,
                task.getDueDate()
        );
    }
}
