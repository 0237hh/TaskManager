package com.huijeong.taskmanager.controller;

import com.huijeong.taskmanager.dto.TaskRequestDto;
import com.huijeong.taskmanager.dto.TaskResponseDto;
import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getTasks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.getTasks(user));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Task>> getUserTasks(@AuthenticationPrincipal UserDetails userDetails) {
        List<Task> tasks = taskService.getUserTasks(userDetails.getUsername());
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody TaskRequestDto request,
                                                      @AuthenticationPrincipal User user) {

        if (user == null) {
            throw new RuntimeException("-----------------> 🛑 인증된 유저 정보가 없습니다!"); // 예외 발생
        }
        return ResponseEntity.ok(taskService.createTask(request, user));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable Long taskId,
                                                      @RequestBody TaskRequestDto request,
                                                      @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.updateTask(taskId, request, user));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId,
                                           @AuthenticationPrincipal User user) {
        taskService.deleteTask(taskId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<TaskResponseDto>> getTaskHistory(
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam int day) {
        List<TaskResponseDto> tasks = taskService.getTaskHistory(year, month, day);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/order")
    public ResponseEntity<Void> updateTaskOrder(@RequestBody List<Long> taskIds,
                                                @AuthenticationPrincipal User user) {
        taskService.updateTaskOrder(taskIds, user);
        return ResponseEntity.ok().build();
    }
}
