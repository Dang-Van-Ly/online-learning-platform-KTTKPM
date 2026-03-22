package com.onlinelearning.backend.course.service;

import com.onlinelearning.backend.course.entity.Lesson;
import com.onlinelearning.backend.course.repository.LessonRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LessonService {
    private final LessonRepository repo;

    public LessonService(LessonRepository repo) {
        this.repo = repo;
    }

    public Lesson create(Lesson lesson) {
        lesson.setCreatedAt(LocalDateTime.now());
        return repo.save(lesson);
    }

    public List<Lesson> getAll() { return repo.findAll(); }

    public Lesson getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Bài học không tồn tại"));
    }

    public List<Lesson> getByChapterId(Long chapterId) {
        return repo.findByChapterId(chapterId);
    }

    public Lesson update(Long id, Lesson newData) {
        Lesson lesson = getById(id);
        lesson.setTitle(newData.getTitle());
        lesson.setOrderNumber(newData.getOrderNumber());
        lesson.setIsFree(newData.getIsFree());
        lesson.setStatus(newData.getStatus());
        return repo.save(lesson);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}