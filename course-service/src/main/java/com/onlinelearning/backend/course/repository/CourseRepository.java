package com.onlinelearning.backend.course.repository;

import com.onlinelearning.backend.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // Tìm kiếm khóa học theo tên (phục vụ tính năng Search)
    List<Course> findByNameContainingIgnoreCase(String name);

    // Tìm kiếm các khóa học theo trạng thái (ví dụ: ACTIVE)
    List<Course> findByStatus(String status);

    // Tìm kiếm khóa học theo danh mục
    List<Course> findByCategoryIgnoreCase(String category);

    // Tìm kiếm khóa học theo trạng thái trong danh sách
    List<Course> findByStatusIn(List<String> statuses);

    // Tìm kiếm khóa học theo danh mục và nhiều trạng thái
    List<Course> findByCategoryIgnoreCaseAndStatusIn(String category, List<String> statuses);

    // Lấy danh sách khóa học mới nhất (chỉ PUBLISHED hoặc ACTIVE)
    @Query("SELECT c FROM Course c WHERE c.status IN ('PUBLISHED','ACTIVE') ORDER BY c.createdAt DESC, c.id DESC")
    List<Course> findNewestCourses(org.springframework.data.domain.Pageable pageable);

    // Lấy danh sách khóa học nổi bật nhất dựa trên số lượng học viên thực tế (chỉ PUBLISHED hoặc ACTIVE)
    @Query("SELECT c FROM Course c LEFT JOIN Enrollment e ON e.course.id = c.id WHERE c.status IN ('PUBLISHED','ACTIVE') GROUP BY c.id ORDER BY COUNT(e) DESC, c.id DESC")
    List<Course> findTopCourses(org.springframework.data.domain.Pageable pageable);

    // Count enrollments for a course
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId")
    long countEnrollmentsByCourseId(@Param("courseId") Long courseId);

    // Sum revenue for a course (pricePaid per enrollment)
    @Query("SELECT COALESCE(SUM(e.pricePaid),0) FROM Enrollment e WHERE e.course.id = :courseId")
    Double sumRevenueByCourseId(@Param("courseId") Long courseId);

    // Count courses by status (e.g., ACTIVE, PENDING, REJECTED)
    long countByStatus(String status);

    // Count courses by multiple statuses
    long countByStatusIn(List<String> statuses);
}