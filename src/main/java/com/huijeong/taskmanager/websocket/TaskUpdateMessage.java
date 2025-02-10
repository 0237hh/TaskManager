package com.huijeong.taskmanager.websocket;

import com.huijeong.taskmanager.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateMessage {
    private Long taskId;
    private String action;
    private Task task;
}
