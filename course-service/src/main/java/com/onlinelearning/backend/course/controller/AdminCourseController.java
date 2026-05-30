package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/courses")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminCourseController {

    private final CourseService courseService;

    public AdminCourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Lấy danh sách chờ duyệt
    @GetMapping("/pending")
    public ResponseEntity<List<Course>> getPendingCourses() {
        return ResponseEntity.ok(courseService.getPendingCourses());
    }

    // Phê duyệt khóa học (Status -> "1")
    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveCourse(@PathVariable Long id) {
        courseService.approveCourse(id);
        return ResponseEntity.ok("Đã duyệt khóa học ID " + id + " thành công!");
    }

    // Từ chối khóa học (Status -> "2")
    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectCourse(@PathVariable Long id) {
        courseService.rejectCourse(id);
        return ResponseEntity.ok("Đã từ chối khóa học ID " + id + " thành công!");
    }

    // Xóa vĩnh viễn khóa học
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.ok("Đã xóa khóa học khỏi hệ thống thành công.");
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        // Gọi hàm lấy tất cả từ Service đã viết sẵn
        return ResponseEntity.ok(courseService.getAll());
    }
}