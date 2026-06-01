package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.service.CourseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

<<<<<<<< HEAD:course-service/src/main/java/com/onlinelearning/backend/course/controller/AdminCourseController.java
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
========
>>>>>>>> origin/nga:backend/src/main/java/com/onlinelearning/backend/course/controller/AdminCourseController.java
@RestController
@RequestMapping("/api/admin/courses")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminCourseController {

    private final CourseService courseService;

    public AdminCourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/pending")
    public ResponseEntity<Page<Course>> getPendingCourses(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(courseService.getPendingCourses(pageable));
    }

    @GetMapping
    public ResponseEntity<Page<Course>> getAllCourses(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(courseService.getAll(pageable));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveCourse(@PathVariable Long id) {
        courseService.approveCourse(id);
        return ResponseEntity.ok("Success");
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectCourse(@PathVariable Long id) {
        courseService.rejectCourse(id);
        return ResponseEntity.ok("Rejected");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.ok("Deleted");
    }
}