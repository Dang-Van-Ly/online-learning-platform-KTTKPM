package com.onlinelearning.backend.user.controller;

import com.onlinelearning.backend.user.dto.UserDTO;
import com.onlinelearning.backend.user.entity.Role;
import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.user.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
<<<<<<<< HEAD:auth-service/src/main/java/com/onlinelearning/backend/user/controller/AdminUserController.java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

========
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
>>>>>>>> origin/nga:backend/src/main/java/com/onlinelearning/backend/user/controller/AdminUserController.java
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminUserController {

    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(AdminUserController.class);

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    // ================= QUẢN LÝ TRUY VẤN DANH SÁCH =================

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/students")
    public ResponseEntity<?> getStudents(
<<<<<<<< HEAD:auth-service/src/main/java/com/onlinelearning/backend/user/controller/AdminUserController.java
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        try {
            return ResponseEntity.ok(userService.getUsersByRole(Role.USER, page, pageable));
        } catch (Exception e) {
            logger.error("Error fetching students page {} size {}", page, size, e);
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi máy chủ khi lấy danh sách học viên."));
        }
========
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        // Dùng @PageableDefault để tự động lấy page và size từ URL (?page=0&size=10)
        return ResponseEntity.ok(userService.getUsersByRole(Role.USER, pageable));
>>>>>>>> origin/nga:backend/src/main/java/com/onlinelearning/backend/user/controller/AdminUserController.java
    }

    @GetMapping("/instructors")
    public ResponseEntity<?> getInstructors(
<<<<<<<< HEAD:auth-service/src/main/java/com/onlinelearning/backend/user/controller/AdminUserController.java
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        try {
            return ResponseEntity.ok(userService.getUsersByRole(Role.INSTRUCTOR, page, pageable));
        } catch (Exception e) {
            logger.error("Error fetching instructors page {} size {}", page, size, e);
            return ResponseEntity.status(500).body(Map.of("message", "Lỗi máy chủ khi lấy danh sách giảng viên."));
        }
========
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(userService.getUsersByRole(Role.INSTRUCTOR, pageable));
>>>>>>>> origin/nga:backend/src/main/java/com/onlinelearning/backend/user/controller/AdminUserController.java
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    // ================= QUẢN LÝ NGHIỆP VỤ TÀI KHOẢN =================

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody User newUser, @RequestParam String roleType) {
        try {
            if ("STUDENT".equalsIgnoreCase(roleType)) {
                newUser.setRole(Role.USER);
            } else if ("INSTRUCTOR".equalsIgnoreCase(roleType)) {
                newUser.setRole(Role.INSTRUCTOR);
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Vai trò hệ thống không hợp lệ."));
            }

            newUser.setStatus(true);
            User savedUser = userService.register(newUser);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Khởi tạo tài khoản thất bại: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok("Trạng thái tài khoản người dùng đã được cập nhật thành công.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Đã xóa người dùng khỏi hệ thống.");
    }
}