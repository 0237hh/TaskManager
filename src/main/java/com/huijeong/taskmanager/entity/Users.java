package com.huijeong.taskmanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    @Column(nullable = false, unique = true, length = 50)
    private String user_name;

    @Column(nullable = false, unique = true, length = 50)
    private String user_email;

    @Column(nullable = false, length = 255)
    private String user_password;

    @Column(nullable = false)
    private LocalDateTime join_at;
}
