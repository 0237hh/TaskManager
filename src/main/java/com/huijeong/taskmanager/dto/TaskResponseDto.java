package com.huijeong.taskmanager.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private String userEmail;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private LocalDate dueDate;

    public static TaskResponseDto fromEntity(Task task) {
        return new TaskResponseDto(
                task.getTaskId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getUser().getUserEmail(),
                task.getCreatedAt(),
                task.getCompletedAt() != null ? task.getCompletedAt() : null,
                task.getDueDate()
        );
    }
}
