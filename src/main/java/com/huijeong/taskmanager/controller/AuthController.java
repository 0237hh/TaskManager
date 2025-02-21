package com.huijeong.taskmanager.controller;

import com.huijeong.taskmanager.dto.UserDto;
import com.huijeong.taskmanager.dto.UserLoginRequestDto;
import com.huijeong.taskmanager.dto.UserSignupRequestDto;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.repository.UserRepository;
import com.huijeong.taskmanager.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
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
        if (request == null) {
            log.error("❌ `RegisterRequest`가 null로 들어옴! JSON 매핑 문제?");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청입니다.");
        }

        log.info("✅ 회원가입 요청: 이메일={}, 유저이름={}", request.getUserEmail(), request.getUserName());

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
        log.info("✅ 로그인 요청: 이메일={}", request.getEmail());

        User user = userRepository.findByUserEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("❌ 존재하지 않는 이메일: {}", request.getEmail());
                    return new UsernameNotFoundException("User not found");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getUserPassword())) {
            log.error("❌ 비밀번호 불일치: 이메일={}", request.getEmail());
            throw new BadCredentialsException("Invalid password");
        }

        log.info("✅ 비밀번호 확인 완료: 이메일={}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.createToken(request.getEmail());

        log.info("✅ 로그인 성공: 이메일={}, 토큰 발급 완료", request.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            log.error("❌ userDetails가 null입니다! 인증되지 않은 요청입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("✅ 인증된 사용자 정보 조회: 이메일={}", userDetails.getUsername());
        UserDto userDto = new UserDto(userDetails.getUsername(), userDetails.getUsername());
        return ResponseEntity.ok(userDto);
    }
}
