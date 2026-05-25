package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.repository.CourseRepository;
import com.onlinelearning.backend.user.entity.Role;
import com.onlinelearning.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private UserRepository userRepo;

    @GetMapping
    public ResponseEntity<?> getDetailedStats() {
        Map<String, Object> data = new HashMap<>();

        // 1. Thống kê User theo Role (Đã sửa thành Enum chuẩn theo dự án)
        Map<String, Long> userRoleStats = new HashMap<>();
        userRoleStats.put("Học viên", userRepo.countByRole(Role.USER));
        userRoleStats.put("Giảng viên", userRepo.countByRole(Role.INSTRUCTOR));
        userRoleStats.put("Quản trị", userRepo.countByRole(Role.ADMIN));
        data.put("userRoles", userRoleStats);

        // 2. Thống kê Khóa học theo Trạng thái
        Map<String, Long> courseStatusStats = new HashMap<>();
        courseStatusStats.put("Đã duyệt", courseRepo.countByStatusIn(java.util.Arrays.asList("PUBLISHED", "ACTIVE")));
        courseStatusStats.put("Đang chờ", courseRepo.countByStatus("PENDING"));
        courseStatusStats.put("Từ chối", courseRepo.countByStatus("REJECTED"));
        data.put("courseStatus", courseStatusStats);

        // 3. Các con số tổng quát
        data.put("totalUsers", userRepo.count());
        data.put("totalCourses", courseRepo.count());
        data.put("totalRevenue", 0);

        return ResponseEntity.ok(data);
    }
}