package com.onlinelearning.backend.enrollment.repository;

import com.onlinelearning.backend.enrollment.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    
    @Query("SELECT e FROM Enrollment e JOIN FETCH e.course c JOIN FETCH e.user u " +
           "WHERE c.instructorId = :instructorId ORDER BY e.enrolledAt DESC")
    List<Enrollment> findByCourseInstructorIdOrderByEnrolledAtDesc(@Param("instructorId") String instructorId);

    /**
     * Đếm số khóa học user đã enroll trong ngày hôm nay (từ startOfDay đến endOfDay).
     */
    @Query("SELECT COUNT(e) FROM Enrollment e " +
           "WHERE e.user.id = :userId " +
           "AND e.enrolledAt >= :startOfDay " +
           "AND e.enrolledAt < :endOfDay")
    long countEnrollmentsToday(
            @Param("userId") Long userId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);
}