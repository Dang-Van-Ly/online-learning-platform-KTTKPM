package com.onlinelearning.backend.course.repository;
import com.onlinelearning.backend.course.entity.Lesson_file;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface Lesson_fileRepository extends JpaRepository<Lesson_file, Long> {
    List<Lesson_file> findByLessonId(Long lessonId);

}
