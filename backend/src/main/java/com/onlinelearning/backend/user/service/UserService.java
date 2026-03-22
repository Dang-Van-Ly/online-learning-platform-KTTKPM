package com.onlinelearning.backend.user.service;

import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public User register(User user) {

        if(repo.existsByEmail(user.getEmail())){
            throw new RuntimeException("Email đã tồn tại");
        }

        if(repo.existsByUsername(user.getUsername())){
            throw new RuntimeException("Username đã tồn tại");
        }

        user.setCreatedAt(LocalDateTime.now());
        user.setStatus(true);

        return repo.save(user);
    }


    // READ ONE
    public User getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
    }

    // READ ALL
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // UPDATE
    public User updateUser(Long id, User newUser) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        user.setUsername(newUser.getUsername());
        user.setEmail(newUser.getEmail());
        user.setPhone(newUser.getPhone());
        user.setAvatar(newUser.getAvatar());
        user.setBio(newUser.getBio());
        user.setRole(newUser.getRole());

        return repo.save(user);
    }

    // DELETE
    public void deleteUser(Long id) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        repo.delete(user);
    }
}
