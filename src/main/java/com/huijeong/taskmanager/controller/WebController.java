package com.huijeong.taskmanager.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController implements ErrorController {
    @GetMapping({"/", "/login", "/register", "/profile", "/tasks", "/error", "/oauth2/callback","/refresh" })
    public String index() {
        return "index.html";
    }
}