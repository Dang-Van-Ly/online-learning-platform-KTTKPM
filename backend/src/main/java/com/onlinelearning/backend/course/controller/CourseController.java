package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.service.CourseService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @PostMapping
    public Course addCourse(@RequestBody Course course) {
        return service.create(course);
    }

    @GetMapping
    public List<Course> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Course getOne(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable Long id, @RequestBody Course course) {
        return service.update(id, course);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Xóa khóa học thành công";
    }
}