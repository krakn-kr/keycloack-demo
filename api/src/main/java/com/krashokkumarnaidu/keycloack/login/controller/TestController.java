package com.krashokkumarnaidu.keycloack.login.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/api/public")
    public String publicEndpoint() {
        return "This is a public endpoint.";
    }

    @GetMapping("/api/protected")
    public String protectedEndpoint() {
        System.out.println("protectedEndpoint controller method started");
        return "This is a protected endpoint. You are authenticated!";
    }
}
