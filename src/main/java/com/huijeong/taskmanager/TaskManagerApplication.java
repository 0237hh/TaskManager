package com.huijeong.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.Base64;

@SpringBootApplication
public class TaskManagerApplication {

    public static void main(String[] args){
        SpringApplication.run(TaskManagerApplication.class, args);
    }

}
