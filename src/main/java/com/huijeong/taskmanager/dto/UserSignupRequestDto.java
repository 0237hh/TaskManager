package com.huijeong.taskmanager.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupRequestDto {
    @JsonProperty("username")
    private String userName;

    @JsonProperty("email")
    private String userEmail;

    @JsonProperty("password")
    private String userPassword;
}
