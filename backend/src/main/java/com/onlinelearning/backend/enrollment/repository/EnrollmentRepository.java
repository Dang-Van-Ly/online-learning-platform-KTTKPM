package com.onlinelearning.backend.enrollment.repository;

import com.onlinelearning.backend.enrollment.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    // Sửa String thành Long ở đây
    List<Enrollment> findByUserId(Long userId);
}