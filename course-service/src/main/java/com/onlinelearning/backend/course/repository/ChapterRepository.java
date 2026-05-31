package com.onlinelearning.backend.course.repository;

import com.onlinelearning.backend.course.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    // Hàm này cực kỳ quan trọng để lấy tất cả chương của 1 khóa học cụ thể
    List<Chapter> findByCourseId(Long courseId);
}