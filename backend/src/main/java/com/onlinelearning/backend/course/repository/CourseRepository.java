package com.onlinelearning.backend.course.repository;

import com.onlinelearning.backend.course.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByNameContainingIgnoreCase(String name);
    List<Course> findByCategoryIgnoreCase(String category);

    Page<Course> findByStatus(String status, Pageable pageable);

    Page<Course> findAll(Pageable pageable);

    long countByStatus(String status);
}