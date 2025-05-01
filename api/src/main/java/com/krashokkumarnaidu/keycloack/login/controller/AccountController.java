package com.krashokkumarnaidu.keycloack.login.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v2/api")
public class AccountController {

    // Public endpoint accessible to all
    @GetMapping("/public")
    public ResponseEntity<Map<String, String>> publicEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a public endpoint");
        return ResponseEntity.ok(response);
    }

    // Protected endpoint requiring manage-account role
    @GetMapping("/account/profile")
    @PreAuthorize("hasAuthority('ROLE_manage-account')")
    public ResponseEntity<Map<String, Object>> getAccountProfile() {
        // Get the current authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        JwtAuthenticationToken token = (JwtAuthenticationToken) authentication;

        // Extract user details from the token
        Map<String, Object> attributes = token.getTokenAttributes();
        Map<String, Object> profile = new HashMap<>();

        // Extract only the information you want to return
        profile.put("sub", attributes.get("sub"));
        profile.put("email", attributes.get("email"));
        profile.put("name", attributes.get("name"));
        profile.put("preferred_username", attributes.get("preferred_username"));

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile retrieved successfully");
        response.put("profile", profile);

        return ResponseEntity.ok(response);
    }

    // Method-level security using PreAuthorize annotation
    @GetMapping("/account/settings")
    @PreAuthorize("hasAuthority('ROLE_manage-account')")
    public ResponseEntity<Map<String, Object>> getAccountSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("notifications", true);
        settings.put("twoFactorAuth", false);
        settings.put("language", "en");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Account settings retrieved successfully");
        response.put("settings", settings);

        return ResponseEntity.ok(response);
    }

    // Endpoint for users with react-keycloack role
    @GetMapping("/client/data")
    @PreAuthorize("hasAuthority('ROLE_react-keycloack')")
    public ResponseEntity<Map<String, Object>> getClientData() {
        Map<String, Object> data = new HashMap<>();
        data.put("clientSpecificData", "This data is only accessible to users with react-keycloack role");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Client data retrieved successfully");
        response.put("data", data);

        return ResponseEntity.ok(response);
    }

    // Endpoint requiring both manage-account and react-keycloack roles
    @GetMapping("/account/advanced")
    @PreAuthorize("hasAuthority('ROLE_manage-account') and hasAuthority('ROLE_react-keycloack')")
    public ResponseEntity<Map<String, Object>> getAdvancedAccountSettings() {
        Map<String, Object> advancedSettings = new HashMap<>();
        advancedSettings.put("apiKeys", "sample-key-1234");
        advancedSettings.put("developer", true);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Advanced account settings retrieved successfully");
        response.put("advancedSettings", advancedSettings);

        return ResponseEntity.ok(response);
    }
}