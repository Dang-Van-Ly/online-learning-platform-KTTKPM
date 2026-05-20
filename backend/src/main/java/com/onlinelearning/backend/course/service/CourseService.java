package com.onlinelearning.backend.course.service;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.repository.CourseRepository;
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

    private static final String PENDING = "PENDING";
    private static final String APPROVED = "ACTIVE";
    private static final String REJECTED = "REJECTED";

    // ================= ADMIN LOGIC =================

    public List<Course> getPendingCourses() {
        return executeWithRetry(() -> repo.findByStatus(PENDING), "GET PENDING");
    }

    @CacheEvict(value = "courses", allEntries = true)
    @Transactional
    public void approveCourse(Long id) {
        executeWithRetry(() -> {
            Course course = repo.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
            course.setStatus(APPROVED);
            course.setUpdatedAt(LocalDateTime.now());
            return repo.save(course);
        }, "APPROVE COURSE");
    }

    @CacheEvict(value = "courses", allEntries = true)
    @Transactional
    public void rejectCourse(Long id) {
        executeWithRetry(() -> {
            Course course = repo.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
            course.setStatus(REJECTED);
            course.setUpdatedAt(LocalDateTime.now());
            return repo.save(course);
        }, "REJECT COURSE");
    }

    // ================= PUBLIC CRUD LOGIC (Cần thiết cho CourseController) =================

    public List<Course> getAll() {
        return executeWithRetry(() -> repo.findAll(), "GET ALL");
    }

    public List<Course> getByCategory(String category) {
        return executeWithRetry(() -> repo.findByCategoryIgnoreCase(category), "GET BY CATEGORY");
    }

    public Course getById(Long id) {
        return executeWithRetry(() -> repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found")), "GET BY ID");
    }

    @Transactional
    public Course update(Long id, Course newData) {
        return executeWithRetry(() -> {
            Course course = repo.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
            course.setName(newData.getName());
            course.setDescription(newData.getDescription());
            course.setPrice(newData.getPrice());
            course.setImage(newData.getImage());
            course.setCategory(newData.getCategory());
            course.setUpdatedAt(LocalDateTime.now());
            return repo.save(course);
        }, "UPDATE COURSE");
    }

    public Course create(Course course) {
        return executeWithRetry(() -> {
            course.setCreatedAt(LocalDateTime.now());
            course.setUpdatedAt(LocalDateTime.now());
            if (course.getStatus() == null) course.setStatus(PENDING);
            return repo.save(course);
        }, "CREATE COURSE");
    }

    public void delete(Long id) {
        executeWithRetry(() -> {
            repo.deleteById(id);
            return null;
        }, "DELETE COURSE");
    }

    // ================= RETRY HELPER =================

    private <T> T executeWithRetry(RetrySupplier<T> action, String actionName) {
        int maxRetry = 3;
        int attempt = 0;
        while (true) {
            try {
                attempt++;
                return action.get();
            } catch (Exception e) {
                if (attempt >= maxRetry) throw new RuntimeException(actionName + " failed after " + maxRetry + " attempts");
                try { Thread.sleep(2000); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
            }
        }
    }

    @FunctionalInterface
    private interface RetrySupplier<T> { T get(); }
}