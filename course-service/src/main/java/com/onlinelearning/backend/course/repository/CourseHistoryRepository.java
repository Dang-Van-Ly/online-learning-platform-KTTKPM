package com.onlinelearning.backend.course.repository;

import com.onlinelearning.backend.course.entity.CourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Long> {

    @Query("SELECT h FROM CourseHistory h JOIN h.course c WHERE c.instructorId = :instructorId ORDER BY h.changedAt DESC")
    List<CourseHistory> findByCourseInstructorIdOrderByChangedAtDesc(@Param("instructorId") String instructorId);

    List<CourseHistory> findByCourseIdOrderByChangedAtDesc(Long courseId);
}
