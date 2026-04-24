package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // Chỉ định rõ origin của frontend
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    // Lấy danh sách khóa học (API mà bạn đang bị lỗi 500)
    @GetMapping
    public ResponseEntity<List<Course>> getAll(
            @RequestParam(required = false) String category
    ) {
        try {
            List<Course> courses = (category == null || category.isBlank())
                    ? service.getAll()
                    : service.getByCategory(category);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra console để debug
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Thêm khóa học mới - Trả về 201 Created
    @PostMapping
    public ResponseEntity<Course> addCourse(@RequestBody Course course) {
        Course savedCourse = service.create(course);
        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
    }

    // Lấy chi tiết 1 khóa học
    @GetMapping("/{id}")
    public ResponseEntity<Course> getOne(@PathVariable Long id) {
        Course course = service.getById(id);
        if (course != null) {
            return ResponseEntity.ok(course);
        }
        return ResponseEntity.notFound().build();
    }

    // Cập nhật khóa học
    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody Course course) {
        Course updatedCourse = service.update(id, course);
        return ResponseEntity.ok(updatedCourse);
    }

    // Xóa khóa học
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Xóa khóa học thành công");
    }
}