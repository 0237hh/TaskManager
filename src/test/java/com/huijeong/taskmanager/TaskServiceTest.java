package com.huijeong.taskmanager;

import com.huijeong.taskmanager.entity.Task;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.repository.TaskRepository;
import com.huijeong.taskmanager.service.NotificationService;
import com.huijeong.taskmanager.service.TaskService;
import com.huijeong.taskmanager.util.TaskStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {
    @Mock
    private TaskRepository taskRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TaskService taskService;

    @Test
    void 완료_처리시_completedAt이_세팅된다() {
        // given
        User user = User.builder()
                .userEmail("test@test.com")
                .userName("테스트유저")
                .build();

        Task task = Task.builder()
                .taskId(1L)
                .title("테스트 태스크")
                .status(TaskStatus.IN_PROGRESS)
                .user(user)
                .build();

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        // when
        taskService.completeTask(1L, user);

        // then
        assertThat(task.getStatus()).isEqualTo(TaskStatus.DONE);
        assertThat(task.getCompletedAt()).isNotNull();
    }
}
