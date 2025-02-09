package com.huijeong.taskmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupRequest {
    private String userName;
    private String userEmail;
    private String userPassword;
}
