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
        return executeWithRetry(() -> {
            course.setCreatedAt(LocalDateTime.now());
            course.setUpdatedAt(LocalDateTime.now());
            return repo.save(course);
        }, "CREATE COURSE");
    }

    // ================= GET ALL (CACHE) =================
    @Cacheable(value = "courses")
    public List<Course> getAll() {
        return executeWithRetry(() -> repo.findAll(), "GET ALL COURSES");
    }

    // ================= GET BY ID (CACHE + RETRY) =================
    @Cacheable(value = "course", key = "#id")
    public Course getById(Long id) {
        return executeWithRetry(() ->
                        repo.findById(id)
                                .orElseThrow(() -> new RuntimeException("Course không tồn tại"))
                , "GET COURSE BY ID");
    }

    // ================= UPDATE (CACHE CLEAR + RETRY) =================
    @CacheEvict(value = "courses", allEntries = true)
    public Course update(Long id, Course newData) {
        return executeWithRetry(() -> {

            Course course = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course không tồn tại"));

            course.setName(newData.getName());
            course.setDescription(newData.getDescription());
            course.setPrice(newData.getPrice());
            course.setImage(newData.getImage());
            course.setStatus(newData.getStatus());
            course.setUpdatedAt(LocalDateTime.now());

            return repo.save(course);

        }, "UPDATE COURSE");
    }

    // ================= DELETE (CACHE CLEAR + RETRY) =================
    @CacheEvict(value = "courses", allEntries = true)
    public void delete(Long id) {
        executeWithRetry(() -> {
            repo.deleteById(id);
            return null;
        }, "DELETE COURSE");
    }

    // ================= RETRY CORE LOGIC =================
    private <T> T executeWithRetry(RetrySupplier<T> action, String actionName) {

        int maxRetry = 3;
        int attempt = 0;

        while (true) {
            try {
                attempt++;

                System.out.println("[" + actionName + "] Attempt " + attempt);

                return action.get();

            } catch (Exception e) {

                System.out.println("[" + actionName + "] Failed attempt " + attempt + ": " + e.getMessage());

                if (attempt >= maxRetry) {
                    throw new RuntimeException(actionName + " failed after " + maxRetry + " retries");
                }

                try {
                    Thread.sleep(3000); // ⬅️ delay 3 giây
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Retry interrupted");
                }
            }
        }
    }

    // functional interface
    @FunctionalInterface
    private interface RetrySupplier<T> {
        T get();
    }
}