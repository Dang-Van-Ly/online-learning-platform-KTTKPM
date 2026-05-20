package com.onlinelearning.backend.user.controller;

import com.onlinelearning.backend.user.dto.UserDTO;
import com.onlinelearning.backend.user.entity.Role;
import com.onlinelearning.backend.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    // BỔ SUNG: Dùng để đổ dữ liệu vào cái BẢNG QUẢN LÝ USER bên React
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // [Use Case: Quản lí học viên]
    @GetMapping("/students")
    public ResponseEntity<?> getStudents() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.USER));
    }

    // [Use Case: Quản lí giáo viên]
    @GetMapping("/instructors")
    public ResponseEntity<?> getInstructors() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.INSTRUCTOR));
    }

    // [Use Case: Khóa/Mở khóa tài khoản]
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        // Lưu ý: Đảm bảo trong UserService của Nga đã có hàm toggleUserStatus nhé!
        userService.toggleUserStatus(id);
        return ResponseEntity.ok("Trạng thái người dùng đã được cập nhật thành công!");
    }

    // Xem chi tiết một người dùng bất kỳ
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    // Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Đã xóa người dùng khỏi hệ thống.");
    }

}