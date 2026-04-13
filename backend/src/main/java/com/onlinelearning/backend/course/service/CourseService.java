package com.onlinelearning.backend.course.service;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.repository.CourseRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourseService {

    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    // ================= CREATE =================
    public Course create(Course course) {
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return repo.save(course);
    }

    // ================= GET ALL (CACHE) =================
    @Cacheable(value = "courses")
    public List<Course> getAll() {
        return repo.findAll();
    }

    // ================= GET BY ID (CACHE) =================
    @Cacheable(value = "course", key = "#id")
    public Course getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course không tồn tại"));
    }

    // ================= UPDATE (CLEAR CACHE) =================
    @CacheEvict(value = "courses", allEntries = true)
    public Course update(Long id, Course newData) {

        Course course = getById(id);

        course.setName(newData.getName());
        course.setDescription(newData.getDescription());
        course.setPrice(newData.getPrice());
        course.setImage(newData.getImage());
        course.setStatus(newData.getStatus());
        course.setUpdatedAt(LocalDateTime.now());

        return repo.save(course);
    }

    // ================= DELETE (CLEAR CACHE) =================
    @CacheEvict(value = "courses", allEntries = true)
    public void delete(Long id) {
        repo.deleteById(id);
    }
}