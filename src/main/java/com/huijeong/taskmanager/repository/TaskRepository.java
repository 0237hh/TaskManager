package com.huijeong.taskmanager.repository;

import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser (User user);
    List<Task> findByCompletedAtBetween (LocalDateTime start, LocalDateTime end);
    List<Task> findByDueDateBetweenAndNotifiedFalse(LocalDate start, LocalDate end);
}
