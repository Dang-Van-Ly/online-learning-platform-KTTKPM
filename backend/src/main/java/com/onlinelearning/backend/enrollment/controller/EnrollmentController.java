package com.onlinelearning.backend.enrollment.controller;

import com.onlinelearning.backend.enrollment.entity.Enrollment;
import com.onlinelearning.backend.enrollment.service.EnrollmentService;
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
    public Enrollment createEnrollment(@RequestBody Enrollment enrollment) {
        return enrollmentService.save(enrollment);
    }

    // Trong EnrollmentController.java
    @GetMapping("/user/{userId}")
    public List<Enrollment> getByUser(@PathVariable Long userId) { // Sửa thành Long
        return enrollmentService.getEnrollmentsByUser(userId);
    }
}