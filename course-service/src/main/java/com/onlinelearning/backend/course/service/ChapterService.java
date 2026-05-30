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
            // Validate files
            if (dto.getFiles() != null && !dto.getFiles().isEmpty()) {
                for (ChapterPublishRequest.FileDto fd : dto.getFiles()) {
                    if (fd.getFileName() == null || fd.getFileName().trim().isEmpty()) {
                        throw new IllegalArgumentException("Tên tệp không được để trống");
                    }
                    if (fd.getFileUrl() == null || fd.getFileUrl().trim().isEmpty()) {
                        throw new IllegalArgumentException("URL tệp không được để trống");
                    }
                    if (fd.getFileType() == null || fd.getFileType().trim().isEmpty()) {
                        throw new IllegalArgumentException("Loại tệp không được để trống");
                    }
                }
            }

            // Fetch course or throw error
            Course course = courseRepo.findById(dto.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Khóa học không tồn tại với mã: " + dto.getCourseId()));

            List<Chapter> existing = repo.findByCourseId(dto.getCourseId());
            int nextChapterOrder = existing.size() + 1;

            Chapter chapter = new Chapter();
            chapter.setCourse(course);
            chapter.setTitle(dto.getTitle() != null ? dto.getTitle().trim() : "");
            chapter.setOrderNumber(nextChapterOrder);
            chapter.setStatus("ACTIVE");
            Chapter savedChapter = repo.save(chapter);
            log.info("Created chapter {} for course {}", savedChapter.getId(), dto.getCourseId());

            Lesson lesson = new Lesson();
            lesson.setChapter(savedChapter);
            lesson.setTitle("Nội dung bài học");
            lesson.setContent(dto.getContent() != null ? dto.getContent() : "");
            lesson.setOrderNumber(1);
            lesson.setIsFree(nextChapterOrder == 1);
            lesson.setStatus("ACTIVE");
            Lesson savedLesson = lessonRepo.save(lesson);
            log.info("Created lesson {} for chapter {}", savedLesson.getId(), savedChapter.getId());

            if (dto.getFiles() != null && !dto.getFiles().isEmpty()) {
                int fileOrder = 1;
                for (ChapterPublishRequest.FileDto fd : dto.getFiles()) {
                    Lesson_file lf = new Lesson_file();
                    lf.setLesson(savedLesson);
                    lf.setFileName(fd.getFileName().trim());
                    lf.setFileUrl(fd.getFileUrl().trim());
                    lf.setFileType(fd.getFileType().trim());
                    lf.setOrderNumber(fileOrder++);
                    lessonFileRepo.save(lf);
                    log.info("Saved file {} for lesson {}", fd.getFileName(), savedLesson.getId());
                }
            }

            log.info("Successfully published chapter {} with {} files", savedChapter.getId(), 
                    dto.getFiles() != null ? dto.getFiles().size() : 0);
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
