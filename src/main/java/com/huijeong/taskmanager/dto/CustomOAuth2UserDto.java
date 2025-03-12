package com.huijeong.taskmanager.dto;

import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collections;
import java.util.Map;

@Getter
public class CustomOAuth2UserDto extends DefaultOAuth2User {
    private final String email;
    private final String role;

    public CustomOAuth2UserDto(Map<String, Object> attributes, String email, String role) {
        super(Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role)), attributes, "email");
        this.email = email;
        this.role = role;
    }
}

