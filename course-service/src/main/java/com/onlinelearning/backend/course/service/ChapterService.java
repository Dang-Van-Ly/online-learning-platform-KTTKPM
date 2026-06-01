package com.onlinelearning.backend.course.service;

import com.onlinelearning.backend.course.entity.Chapter;
import com.onlinelearning.backend.course.repository.ChapterRepository;
import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.entity.Lesson;
import com.onlinelearning.backend.course.entity.Lesson_file;
import com.onlinelearning.backend.course.dto.ChapterPublishRequest;
import com.onlinelearning.backend.course.repository.CourseRepository;
import com.onlinelearning.backend.course.repository.LessonRepository;
import com.onlinelearning.backend.course.repository.Lesson_fileRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Service
@Slf4j
public class ChapterService {

    private final ChapterRepository repo;
    private final CourseRepository courseRepo;
    private final LessonRepository lessonRepo;
    private final Lesson_fileRepository lessonFileRepo;

    public ChapterService(ChapterRepository repo, CourseRepository courseRepo, LessonRepository lessonRepo, Lesson_fileRepository lessonFileRepo) {
        this.repo = repo;
        this.courseRepo = courseRepo;
        this.lessonRepo = lessonRepo;
        this.lessonFileRepo = lessonFileRepo;
    }

    public Chapter create(Chapter chapter) {
        return repo.save(chapter);
    }

    @Transactional
    @CacheEvict(value = {"chapters", "lessons", "lessonsByChapter"}, allEntries = true)
    public Chapter publishChapter(ChapterPublishRequest dto) {
        try {
            // Validate lessons
            if (dto.getLessons() == null || dto.getLessons().isEmpty()) {
                throw new IllegalArgumentException("Chương phải có ít nhất 1 bài học");
            }

            for (ChapterPublishRequest.LessonDto lessonDto : dto.getLessons()) {
                if (lessonDto.getTitle() == null || lessonDto.getTitle().trim().isEmpty()) {
                    throw new IllegalArgumentException("Tiêu đề bài học không được để trống");
                }
            }

            // Fetch course or throw error
            Course course = courseRepo.findById(dto.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Khóa học không tồn tại với mã: " + dto.getCourseId()));

            List<Chapter> existing = repo.findByCourseId(dto.getCourseId());
            int nextChapterOrder = existing.size() + 1;

            // Create Chapter
            Chapter chapter = new Chapter();
            chapter.setCourse(course);
            chapter.setTitle(dto.getTitle() != null ? dto.getTitle().trim() : "");
            chapter.setOrderNumber(nextChapterOrder);
            chapter.setStatus("ACTIVE");
            Chapter savedChapter = repo.save(chapter);
            log.info("Created chapter {} for course {}", savedChapter.getId(), dto.getCourseId());

            // Create multiple Lessons for the Chapter
            int lessonOrder = 1;
            for (ChapterPublishRequest.LessonDto lessonDto : dto.getLessons()) {
                Lesson lesson = new Lesson();
                lesson.setChapter(savedChapter);
                lesson.setTitle(lessonDto.getTitle().trim());
                lesson.setContent(lessonDto.getContent() != null ? lessonDto.getContent() : "");
                lesson.setOrderNumber(lessonOrder);
                lesson.setIsFree(lessonDto.getIsFree() != null ? lessonDto.getIsFree() : (nextChapterOrder == 1 && lessonOrder == 1));
                lesson.setStatus("ACTIVE");
                Lesson savedLesson = lessonRepo.save(lesson);
                log.info("Created lesson {} '{}' for chapter {}", savedLesson.getId(), lessonDto.getTitle(), savedChapter.getId());

                // Save single file per lesson (if provided)
                if (lessonDto.getFileUrl() != null && !lessonDto.getFileUrl().trim().isEmpty()) {
                    Lesson_file lf = new Lesson_file();
                    lf.setLesson(savedLesson);
                    lf.setFileName(lessonDto.getFileName() != null ? lessonDto.getFileName().trim() : "file");
                    lf.setFileUrl(lessonDto.getFileUrl().trim());
                    lf.setFileType(lessonDto.getFileType() != null ? lessonDto.getFileType().trim() : "application/octet-stream");
                    lf.setOrderNumber(1);
                    lessonFileRepo.save(lf);
                    log.info("Saved file '{}' for lesson {}", lessonDto.getFileName(), savedLesson.getId());
                }

                lessonOrder++;
            }

            log.info("Successfully published chapter {} with {} lessons", savedChapter.getId(), dto.getLessons().size());
            return savedChapter;
        } catch (IllegalArgumentException e) {
            log.warn("Validation error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error publishing chapter: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi xảy ra khi xuất bản chương: " + e.getMessage(), e);
        }
    }

    @Cacheable(value = "chapter", key = "#id")
    public Chapter getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Chương học không tồn tại"));
    }

    @Cacheable(value = "chapters", key = "#courseId")
    public List<Chapter> getByCourseId(Long courseId) {
        return repo.findByCourseId(courseId);
    }

    @CacheEvict(value = "chapters", allEntries = true)
    public Chapter update(Long id, Chapter newData) {
        Chapter chapter = getById(id);
        chapter.setTitle(newData.getTitle());
        chapter.setOrderNumber(newData.getOrderNumber());
        chapter.setStatus(newData.getStatus());
        return repo.save(chapter);
    }

    @CacheEvict(value = "chapters", allEntries = true)
    public void delete(Long id) {
        Chapter chapter = getById(id);
        repo.delete(chapter);
    }
}
