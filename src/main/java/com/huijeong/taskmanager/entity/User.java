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
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true, length = 50)
    private String userName;

    @Column(nullable = false, unique = true, length = 50)
    private String userEmail;

    @Column(nullable = false, length = 255)
    private String userPassword;

    @Column(nullable = false)
    private LocalDateTime joinAt;

    private String profileImage;

    @Column(nullable = false, length = 20)
    private String role;

    @PrePersist
    protected void onCreate() {
        this.joinAt = LocalDateTime.now();
    }
}
