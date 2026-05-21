package com.onlinelearning.backend.enrollment.repository;

import com.onlinelearning.backend.enrollment.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    
    List<Enrollment> findByCourseInstructorIdOrderByEnrolledAtDesc(String instructorId);
}