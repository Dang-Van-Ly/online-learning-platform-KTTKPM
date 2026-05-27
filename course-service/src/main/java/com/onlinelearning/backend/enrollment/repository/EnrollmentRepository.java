package com.onlinelearning.backend.enrollment.repository;

import com.onlinelearning.backend.enrollment.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.course JOIN FETCH e.user WHERE e.user.id = :userId")
    List<Enrollment> findByUserId(@Param("userId") Long userId);
    
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    void deleteByCourseId(Long courseId);
    
    @Query("SELECT e FROM Enrollment e JOIN FETCH e.course c JOIN FETCH e.user u " +
           "WHERE c.instructorId = :instructorId ORDER BY e.enrolledAt DESC")
    List<Enrollment> findByCourseInstructorIdOrderByEnrolledAtDesc(@Param("instructorId") String instructorId);

    /**
     * Đếm số khóa học user đã enroll bằng membership trong ngày hôm nay.
     * Chỉ đếm enrollment có type = 'MEMBERSHIP' để không ảnh hưởng đến enrollment mua bằng tiền.
     */
    @Query("SELECT COUNT(e) FROM Enrollment e " +
           "WHERE e.user.id = :userId " +
           "AND e.type = 'MEMBERSHIP' " +
           "AND e.enrolledAt >= :startOfDay " +
           "AND e.enrolledAt < :endOfDay")
    long countEnrollmentsToday(
            @Param("userId") Long userId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);
}