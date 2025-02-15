package com.huijeong.taskmanager.websocket;

import com.huijeong.taskmanager.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements HandshakeInterceptor {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            String token = extractToken(servletRequest);
            if (token != null && jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.getUserEmail(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                attributes.put("user", userDetails);
                return true;
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }

    private String extractToken(ServletServerHttpRequest request) {
        List<String> values = List.of(request.getServletRequest().getParameterMap().get("token"));
        return (values != null && !values.isEmpty()) ? values.get(0) : null;
    }
}
