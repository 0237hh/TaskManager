package com.huijeong.taskmanager.security;

import com.huijeong.taskmanager.dto.CustomOAuth2UserDto;
import com.huijeong.taskmanager.util.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String email = extractEmailFromAuthentication(authentication);
        String token = jwtTokenProvider.createToken(email);

        String redirectUrl = "http://localhost:8080/oauth2/callback?token=" + token;
        response.sendRedirect(redirectUrl);
    }

    private String extractEmailFromAuthentication(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomOAuth2UserDto customUser) {
            return customUser.getEmail();
        } else if (principal instanceof OAuth2User oauth2User) {
            return oauth2User.getAttribute("email");
        } else {
            return authentication.getName();
        }
    }
}
