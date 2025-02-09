package com.huijeong.taskmanager.service;

import com.huijeong.taskmanager.dto.UserSignupRequest;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.repository.UserRepository;
import com.huijeong.taskmanager.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public User signup(UserSignupRequest request) {
        User user = User.builder()
                .userName(request.getUserName())
                .userEmail(request.getUserEmail())
                .userPassword(passwordEncoder.encode(request.getUserPassword()))
                .joinAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    public String login (String email, String password) {
        User user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getUserPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return jwtTokenProvider.createToken(user.getUserEmail());
    }
}
