package com.onlinelearning.backend.course.service;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.repository.CourseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourseService {

    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    public Page<Course> getPendingCourses(Pageable pageable) {
        return repo.findByStatus("PENDING", pageable);
    }

    public Page<Course> getAll(Pageable pageable) {
        return repo.findAll(pageable);
    }

    public List<Course> getAll() { return repo.findAll(); }
    public List<Course> getByCategory(String category) { return repo.findByCategoryIgnoreCase(category); }
    public Course getById(Long id) { return repo.findById(id).orElseThrow(() -> new RuntimeException("Course not found")); }

    @CacheEvict(value = "courses", allEntries = true)
    @Transactional
    public void approveCourse(Long id) {
        Course course = repo.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setStatus("ACTIVE");
        repo.save(course);
    }

    @CacheEvict(value = "courses", allEntries = true)
    @Transactional
    public void rejectCourse(Long id) {
        Course course = repo.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setStatus("REJECTED");
        repo.save(course);
    }

    public Course create(Course course) {
        course.setCreatedAt(LocalDateTime.now());
        if (course.getStatus() == null) course.setStatus("PENDING");
        return repo.save(course);
    }

    public void delete(Long id) { repo.deleteById(id); }

    public Course update(Long id, Course newData) {
        Course course = getById(id);
        course.setName(newData.getName());
        course.setPrice(newData.getPrice());
        return repo.save(course);
    }
}