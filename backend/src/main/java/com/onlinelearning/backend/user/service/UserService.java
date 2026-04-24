package com.onlinelearning.backend.user.service;

import com.onlinelearning.backend.user.dto.UserDTO;
import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.user.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    // ================= REGISTER =================
    public User register(User user) {

        if (repo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        if (repo.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        user.setCreatedAt(LocalDateTime.now());
        user.setStatus(true);

        return repo.save(user);
    }

    // ================= GET BY ID (CACHE DTO) =================
    @Cacheable(value = "user", key = "#id")
    public UserDTO getById(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return mapToDTO(user);
    }

    // ================= GET ALL (CACHE DTO) =================
    @Cacheable(value = "users")
    public List<UserDTO> getAllUsers() {
        return repo.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ================= UPDATE =================
    @CacheEvict(value = {"users", "user"}, allEntries = true)
    public User updateUser(Long id, User newUser) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        user.setUsername(newUser.getUsername());
        user.setEmail(newUser.getEmail());
        user.setPhone(newUser.getPhone());
        user.setAvatar(newUser.getAvatar());
        user.setBio(newUser.getBio());
        user.setRole(newUser.getRole());

        User saved = repo.save(user);

        notifyUserUpdate(saved.getId());

        return saved;
    }

    // ================= DELETE =================
    @CacheEvict(value = {"users", "user"}, allEntries = true)
    public void deleteUser(Long id) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        repo.delete(user);
    }

    // ================= RETRY =================
    @Retryable(
            value = Exception.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000)
    )
    public String notifyUserUpdate(Long userId) {

        User user = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        System.out.println("Sending notification to user: " + user.getEmail());

        if (Math.random() < 0.7) {
            throw new RuntimeException("Notification service failed");
        }

        return "NOTIFICATION_SENT";
    }

    @Recover
    public String fallbackNotify(Exception e, Long userId) {

        System.out.println("Retry failed for userId: " + userId);

        return "NOTIFICATION_FAILED_BUT_SAVED_FOR_LATER";
    }

    // ================= MAPPER =================
    private UserDTO mapToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}