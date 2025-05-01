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

    @GetMapping("/api/protected/tab1-data")
    public String protectedEndpoint1() {
        System.out.println("protectedEndpoint controller method started");
        return "This is a protected endpoint tab1-data. You are authenticated!";
    }
    @GetMapping("/api/protected/tab2-data")
    public String protectedEndpoint2() {
        System.out.println("protectedEndpoint controller method started");
        return "This is a protected endpoint tab2-data. You are authenticated!";
    }
    @GetMapping("/api/protected/tab3-data")
    public String protectedEndpoint3() {
        System.out.println("protectedEndpoint controller method started");
        return "This is a protected endpoint tab3-data. You are authenticated!";
    }
}
