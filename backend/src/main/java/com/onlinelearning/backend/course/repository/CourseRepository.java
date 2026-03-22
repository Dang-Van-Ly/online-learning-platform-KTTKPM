package com.onlinelearning.backend.course.repository;

import com.onlinelearning.backend.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // Tìm kiếm khóa học theo tên (phục vụ tính năng Search)
    List<Course> findByNameContainingIgnoreCase(String name);

    // Tìm kiếm các khóa học theo trạng thái (ví dụ: ACTIVE)
    List<Course> findByStatus(String status);

    // Kiểm tra xem ID khóa học đã tồn tại chưa
    boolean existsById(Long id);
}