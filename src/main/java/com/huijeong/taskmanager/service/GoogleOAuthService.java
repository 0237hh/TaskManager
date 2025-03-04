package com.huijeong.taskmanager.service;

import com.huijeong.taskmanager.dto.GoogleTokenResponseDto;
import com.huijeong.taskmanager.dto.GoogleUserInfoDto;
import com.huijeong.taskmanager.entity.User;
import com.huijeong.taskmanager.repository.UserRepository;
import com.huijeong.taskmanager.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    public String loginWithGoogle(String authorizationCode) {
        GoogleTokenResponseDto tokenResponse = getGoogleTokens(authorizationCode);
        GoogleUserInfoDto userInfo = getGoogleUserInfo(tokenResponse.getAccessToken());
        User user = userRepository.findByUserEmail(userInfo.getEmail())
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .userEmail(userInfo.getEmail())
                            .userName(userInfo.getName())
                            .profileImage(userInfo.getPicture())
                            .role("USER")
                            .build();
                    return userRepository.save(newUser);
                });
        return jwtTokenProvider.createToken(user.getUserEmail());
    }

    private GoogleUserInfoDto getGoogleUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        ResponseEntity<GoogleUserInfoDto> response = restTemplate.exchange(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                HttpMethod.GET,
                entity,
                GoogleUserInfoDto.class
        );
        return response.getBody();
    }

    private GoogleTokenResponseDto getGoogleTokens(String authorizationCode) {
        String tokenUri = "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String requestBody = String.format(
                "code=%s&client_id=%s&client_secret=%s&redirect_uri=%s&grant_type=authorization_code",
                authorizationCode, clientId, clientSecret, redirectUri
        );

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<GoogleTokenResponseDto> response = restTemplate.exchange(
                tokenUri, HttpMethod.POST, request, GoogleTokenResponseDto.class
        );
        return response.getBody();
    }
}

