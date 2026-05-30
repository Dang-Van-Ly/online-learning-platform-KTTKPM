package com.onlinelearning.backend.auth;

import com.onlinelearning.backend.user.entity.Role;

public class AuthResponse {
    private Long id;
    private String token;
    private String username;
    private Role role;

    public AuthResponse(Long id, String token, String username, Role role) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getToken() { return token; }
    public String getUsername() { return username; }
    public Role getRole() { return role; }
}