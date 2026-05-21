package com.onlinelearning.backend.auth;

import com.onlinelearning.backend.user.entity.Role;

public class AuthResponse {

    private String token;
    private String username;
    private String email;
    private Role role;
    private Long userId;

    public AuthResponse(String token, String username, String email, Role role) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public AuthResponse(String token, String username, String email, Role role, Long userId) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public Long getUserId() {
        return userId;
    }
}