package com.onlinelearning.backend.enrollment.controller;

import com.onlinelearning.backend.enrollment.dto.EnrollRequest;
import com.onlinelearning.backend.enrollment.entity.Enrollment;
import com.onlinelearning.backend.enrollment.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<?> createEnrollment(@RequestBody EnrollRequest request) {
        try {
            Enrollment enrollment = enrollmentService.enrollUser(request);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Enrollment>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByUser(userId));
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<Enrollment>> getByInstructor(@PathVariable String instructorId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByInstructor(instructorId));
    }
}