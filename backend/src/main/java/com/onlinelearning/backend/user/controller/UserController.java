package com.onlinelearning.backend.user.controller;

import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.user.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    // READ ONE
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return service.getById(id);
    }

    // READ ALL
    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    // UPDATE
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody User user) {
        return service.updateUser(id, user);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return "User đã bị xóa";
    }
}
