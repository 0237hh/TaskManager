package com.huijeong.taskmanager.dto;

import com.huijeong.taskmanager.util.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequestDto {
    private String title;
    private String description;
    private TaskStatus status;
    private Integer priority = 0;
    private LocalDate dueDate;
 }
