package com.huijeong.taskmanager.controlloer;

import com.huijeong.taskmanager.dto.TaskRequest;
import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        Task task = taskService.createTask(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @PostMapping("/update-order")
    public ResponseEntity<?> updateTaskOrder (@RequestBody List<Long> taskIds) {
        taskService.updateTaskOrder(taskIds);
        return ResponseEntity.ok("Task order updated");
    }

    @GetMapping
    public ResponseEntity<List<Task>> getUserTasks(@AuthenticationPrincipal UserDetails userDetails) {
        List<Task> tasks = taskService.getUserTasks(userDetails.getUsername());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Task>> getTaskHistory( @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
                                                      @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
                                                      @AuthenticationPrincipal User user) {
        List<Task> tasks = taskService.getTasksByDateRange(user, startDate, endDate);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping ("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId,
                                           @RequestBody TaskRequest request,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        Task updateTask = taskService.updateTask(taskId, request, userDetails.getUsername());
        return ResponseEntity.ok(updateTask);
    }

    @PutMapping("/order")
    public ResponseEntity<Void> updateTaskOrder(@PathVariable List<Long> taskIds,
                                                @AuthenticationPrincipal User user) {
        taskService.updateTaskOrder(taskIds, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        taskService.deleteTask(taskId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
