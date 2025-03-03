package com.huijeong.taskmanager.service;

import com.huijeong.taskmanager.dto.CustomOAuth2UserDto;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Optional<User> existingUser = userRepository.findByUserEmail(email);

        User user = existingUser.orElseGet(() -> {
            User newUser = User.builder()
                    .userEmail(email)
                    .userName(name)
                    .userPassword("")
                    .role("USER")
                    .build();
            return userRepository.save(newUser);
        });
        return new CustomOAuth2UserDto(oAuth2User.getAttributes(), user.getUserEmail(), user.getRole());
    }
}
