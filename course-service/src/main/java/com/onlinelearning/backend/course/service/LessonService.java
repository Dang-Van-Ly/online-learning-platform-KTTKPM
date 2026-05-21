package com.onlinelearning.backend.course.service;

import com.onlinelearning.backend.course.entity.Lesson;
import com.onlinelearning.backend.course.repository.LessonRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LessonService {

    private final LessonRepository repo;

    public LessonService(LessonRepository repo) {
        this.repo = repo;
    }

    // ================= CREATE =================
    public Lesson create(Lesson lesson) {
        lesson.setCreatedAt(LocalDateTime.now());
        return repo.save(lesson);
    }

    // ================= GET ALL (CACHE) =================
    @Cacheable(value = "lessons")
    public List<Lesson> getAll() {
        return repo.findAll();
    }

    // ================= GET BY ID (CACHE) =================
    @Cacheable(value = "lesson", key = "#id")
    public Lesson getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Bài học không tồn tại"));
    }

    // ================= GET BY CHAPTER (CACHE) =================
    @Cacheable(value = "lessonsByChapter", key = "#chapterId")
    public List<Lesson> getByChapterId(Long chapterId) {
        return repo.findByChapterId(chapterId);
    }

    // ================= UPDATE (CLEAR CACHE) =================
    @CacheEvict(value = {"lessons", "lesson", "lessonsByChapter"}, allEntries = true)
    public Lesson update(Long id, Lesson newData) {

        Lesson lesson = getById(id);

        lesson.setTitle(newData.getTitle());
        lesson.setOrderNumber(newData.getOrderNumber());
        lesson.setIsFree(newData.getIsFree());
        lesson.setStatus(newData.getStatus());

        return repo.save(lesson);
    }

    // ================= DELETE (CLEAR CACHE) =================
    @CacheEvict(value = {"lessons", "lesson", "lessonsByChapter"}, allEntries = true)
    public void delete(Long id) {
        repo.deleteById(id);
    }
}