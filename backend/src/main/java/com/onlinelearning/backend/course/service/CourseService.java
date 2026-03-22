package com.onlinelearning.backend.course.service;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.repository.CourseRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourseService {
    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    public Course create(Course course) {
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return repo.save(course);
    }

    public List<Course> getAll() {
        return repo.findAll();
    }

    public Course getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Course không tồn tại"));
    }

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

    public void delete(Long id) {
        repo.deleteById(id);
    }
}