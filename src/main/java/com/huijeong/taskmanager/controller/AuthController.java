package com.huijeong.taskmanager.controller;

import com.huijeong.taskmanager.dto.UserLoginRequestDto;
import com.huijeong.taskmanager.dto.UserSignupRequestDto;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.repository.UserRepository;
import com.huijeong.taskmanager.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserSignupRequestDto request) {
        if (userRepository.findByUserEmail(request.getUserEmail()).isPresent()) { // ✅ 수정된 부분
            return ResponseEntity.badRequest().body("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .userEmail(request.getUserEmail())
                .userPassword(passwordEncoder.encode(request.getUserPassword()))
                .userName(request.getUserName())
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("회원가입 성공!");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserLoginRequestDto request) {
        User user = userRepository.findByUserEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getUserPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.createToken(request.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }
}
