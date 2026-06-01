package com.onlinelearning.backend.course.repository;

import com.onlinelearning.backend.course.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    // Eager load lessons using LEFT JOIN FETCH to prevent N+1 query problem
    @Query("SELECT c FROM Chapter c LEFT JOIN FETCH c.lessons WHERE c.course.id = :courseId ORDER BY c.orderNumber ASC")
    List<Chapter> findByCourseId(@Param("courseId") Long courseId);
}