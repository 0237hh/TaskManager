package com.huijeong.taskmanager.scheduler;

import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.repository.TaskRepository;
import com.huijeong.taskmanager.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DueDateNotificationScheduler {

    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    @Scheduled(fixedRate = 3600000) // 1시간마다 체크
    public void checkDueTasks() {
        LocalDate today = LocalDate.now();
        LocalDate soon = today.plusDays(3);

        List<Task> dueTasks = taskRepository
            .findByDueDateBetweenAndNotifiedFalse(today, soon);

        for (Task task : dueTasks) {
            notificationService.sendNotification(
                task.getTitle() + " 마감이 3일 이내입니다."
            );
            task.setNotified(true);
        }
        taskRepository.saveAll(dueTasks);
    }
}