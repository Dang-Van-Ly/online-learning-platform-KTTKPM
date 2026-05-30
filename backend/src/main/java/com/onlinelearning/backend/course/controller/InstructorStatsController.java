package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.repository.CourseRepository;
import com.onlinelearning.backend.enrollment.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/instructor/stats")
public class InstructorStatsController {

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private EnrollmentRepository enrollmentRepo;

    @GetMapping
    public ResponseEntity<?> getInstructorStats(Authentication authentication) {
        Map<String, Object> data = new HashMap<>();

        // Lấy username của instructor đang đăng nhập
        String instructorUsername = authentication.getName();

        // 1. Đếm tổng số khóa học của instructor
        long totalCourses = courseRepo.findAll().stream()
                .filter(course -> instructorUsername.equals(course.getInstructorId()))
                .count();

        // 2. Đếm tổng số học viên (enrollments) trong các khóa học của instructor
        long totalStudents = enrollmentRepo.findAll().stream()
                .filter(enrollment -> {
                    var course = courseRepo.findById(enrollment.getCourse().getId()).orElse(null);
                    return course != null && instructorUsername.equals(course.getInstructorId());
                })
                .count();

        // 3. Tính tổng doanh thu (giả sử mỗi enrollment = 1 lần mua khóa học)
        long totalRevenue = courseRepo.findAll().stream()
                .filter(course -> instructorUsername.equals(course.getInstructorId()))
                .mapToLong(course -> {
                    long enrollmentCount = enrollmentRepo.findAll().stream()
                            .filter(e -> e.getCourse().getId().equals(course.getId()))
                            .count();
                    return (long) (course.getPrice() * enrollmentCount);
                })
                .sum();

        // 4. Tính rating trung bình (mock data - có thể thêm bảng reviews sau)
        double avgRating = 4.8;

        data.put("totalCourses", totalCourses);
        data.put("totalStudents", totalStudents);
        data.put("totalRevenue", totalRevenue);
        data.put("avgRating", avgRating);

        return ResponseEntity.ok(data);
    }
}
