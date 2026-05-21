package com.onlinelearning.backend.enrollment.service;

import com.onlinelearning.backend.enrollment.entity.Enrollment;
import com.onlinelearning.backend.enrollment.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    public Enrollment save(Enrollment enrollment) {
        return enrollmentRepository.save(enrollment);
    }

    // Trong EnrollmentService.java
    public List<Enrollment> getEnrollmentsByUser(Long userId) { // Sửa thành Long
        return enrollmentRepository.findByUserId(userId);
    }
}