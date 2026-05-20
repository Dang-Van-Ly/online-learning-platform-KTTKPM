package com.onlinelearning.backend.user.controller;

import com.onlinelearning.backend.user.dto.UserDTO;
import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.user.service.UserService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000") // Cấp quyền cho React truy cập
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // ================= DÀNH CHO USER / GUEST =================
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return service.updateUser(id, user);
    }
}