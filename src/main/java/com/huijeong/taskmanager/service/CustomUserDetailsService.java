package com.huijeong.taskmanager.service;

import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUserEmail())
                .password(user.getUserPassword()) // Spring Security는 패스워드도 관리해야 함
                .roles("USER")  // 기본 역할 부여
                .build();
    }
}
