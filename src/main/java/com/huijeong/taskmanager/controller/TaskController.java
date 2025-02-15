package com.huijeong.taskmanager.controller;

import com.huijeong.taskmanager.dto.TaskRequestDto;
import com.huijeong.taskmanager.dto.TaskResponseDto;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.service.TaskService;
import com.huijeong.taskmanager.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    // 전체 태스크 조회
    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getTasks(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        List<TaskResponseDto> tasks = taskService.getTasks(user);
        return ResponseEntity.ok(tasks);
    }

    // 지난 태스크 목록 조회
    @GetMapping("/history")
    public ResponseEntity<List<TaskResponseDto>> getTaskHistory(
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam int day) {
        List<TaskResponseDto> tasks = taskService.getTaskHistory(year, month, day);
        return ResponseEntity.ok(tasks);
    }

    // 태스크 생성
    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(@RequestBody @Valid TaskRequestDto request,
                                                      @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(taskService.createTask(request, user));
    }

    // 태스크 수정
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable Long taskId,
                                                      @RequestBody TaskRequestDto request,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(taskService.updateTask(taskId, request, user));
    }

    // 태스크 순서 변경
    @PutMapping("/order")
    public ResponseEntity<Void> updateTaskOrder(@RequestBody List<Long> taskIds,
                                                @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.getUserByEmail(userDetails.getUsername());
        taskService.updateTaskOrder(taskIds, user);
        return ResponseEntity.ok().build();
    }

    // 완료된 태스크 조회
    @PutMapping("/{taskId}/done")
    public ResponseEntity<Void> completeTask(@PathVariable Long taskId,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        taskService.completeTask(taskId, user);
        return ResponseEntity.ok().build();
    }

    // 태스크 삭제
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        taskService.deleteTask(taskId, user);
        return ResponseEntity.noContent().build();
    }
}
