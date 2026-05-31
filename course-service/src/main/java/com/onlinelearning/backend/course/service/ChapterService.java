package com.onlinelearning.backend.course.service;

import com.onlinelearning.backend.course.entity.Chapter;
import com.onlinelearning.backend.course.repository.ChapterRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChapterService {

    private final ChapterRepository repo;

    public ChapterService(ChapterRepository repo) {
        this.repo = repo;
    }

    // ================= CREATE =================
    public Chapter create(Chapter chapter) {
        return repo.save(chapter);
    }

    // ================= GET BY ID (CACHE) =================
    @Cacheable(value = "chapter", key = "#id")
    public Chapter getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Chương học không tồn tại"));
    }

    // ================= GET BY COURSE (CACHE) =================
    @Cacheable(value = "chapters", key = "#courseId")
    public List<Chapter> getByCourseId(Long courseId) {
        return repo.findByCourseId(courseId);
    }

    // ================= UPDATE (CLEAR CACHE) =================
    @CacheEvict(value = "chapters", allEntries = true)
    public Chapter update(Long id, Chapter newData) {

        Chapter chapter = getById(id);

        chapter.setTitle(newData.getTitle());
        chapter.setOrderNumber(newData.getOrderNumber());
        chapter.setStatus(newData.getStatus());

        return repo.save(chapter);
    }

    // ================= DELETE (CLEAR CACHE) =================
    @CacheEvict(value = "chapters", allEntries = true)
    public void delete(Long id) {

        Chapter chapter = getById(id);
        repo.delete(chapter);
    }
}