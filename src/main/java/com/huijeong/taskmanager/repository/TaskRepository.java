package com.huijeong.taskmanager.repository;

import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser (User user);
}
