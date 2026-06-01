package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.dto.CourseRequest;
import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.LinkedHashMap;

import com.onlinelearning.backend.course.entity.CourseHistory;
import com.onlinelearning.backend.course.repository.CourseHistoryRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(CourseController.class);

    private final CourseService service;
    private final CourseHistoryRepository historyRepo;

    public CourseController(CourseService service, CourseHistoryRepository historyRepo) {
        this.service = service;
        this.historyRepo = historyRepo;
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

    // ---------------------------------------------------------------
    // POST /api/courses  — JSON body (dùng cho giao diện hiện tại nhập URL ảnh)
    // ---------------------------------------------------------------
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PostMapping
    public ResponseEntity<Course> addCourse(@RequestBody Course course) {
        Course savedCourse = service.create(course);
        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
    }

    // ---------------------------------------------------------------
    // POST /api/courses/with-image  — multipart/form-data (upload file ảnh lên S3)
    // ---------------------------------------------------------------
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PostMapping(value = "/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addCourseWithImage(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "type", required = false, defaultValue = "PAID") String type,
            @RequestParam(value = "status", required = false, defaultValue = "DRAFT") String status,
            @RequestParam(value = "instructorId", required = false) String instructorId,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image
    ) {
        try {
            com.onlinelearning.backend.course.dto.CourseRequest request = new com.onlinelearning.backend.course.dto.CourseRequest();
            request.setName(name);
            request.setDescription(description);
            request.setPrice(price);
            request.setCategory(category);
            request.setType(type);
            request.setStatus(status);
            request.setInstructorId(instructorId);
            request.setImage(image);

            Course savedCourse = service.createWithImage(request);
            return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Tạo khóa học thất bại: " + e.getMessage());
        }
    }

    // Lấy thông tin trang chủ tổng hợp (gồm top, newest, và grouped categories)
    @GetMapping("/homepage")
    public ResponseEntity<java.util.Map<String, Object>> getHomepageData() {
        return ResponseEntity.ok(service.getHomepageData());
    }

    // Lấy top khóa học nổi bật
    @GetMapping("/top")
    public ResponseEntity<List<Course>> getTopCourses(@RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(service.getTopCourses(limit));
    }

    // Lấy khóa học mới nhất
    @GetMapping("/newest")
    public ResponseEntity<List<Course>> getNewestCourses(@RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(service.getNewestCourses(limit));
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
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody Course course) {
        Course updatedCourse = service.update(id, course);
        return ResponseEntity.ok(updatedCourse);
    }

    // Xóa khóa học
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Xóa khóa học thành công");
    }

    // Lấy lịch sử thay đổi trạng thái của tất cả khóa học của instructor
    @GetMapping("/instructor/{instructorId}/history")
    public ResponseEntity<List<Map<String, Object>>> getInstructorHistory(@PathVariable String instructorId) {
        List<CourseHistory> list = historyRepo.findByCourseInstructorIdOrderByChangedAtDesc(instructorId);

        // Group by course id preserving order
        Map<Long, Map<String, Object>> grouped = new LinkedHashMap<>();
        for (CourseHistory h : list) {
            Long cid = h.getCourse() != null ? h.getCourse().getId() : null;
            if (cid == null) continue;
            Map<String, Object> entry = grouped.get(cid);
            if (entry == null) {
                entry = new HashMap<>();
                entry.put("courseId", cid);
                entry.put("courseName", h.getCourse().getName());
                entry.put("history", new ArrayList<Map<String, Object>>());
                grouped.put(cid, entry);
            }
            List<Map<String, Object>> hist = (List<Map<String, Object>>) entry.get("history");
            Map<String, Object> item = new HashMap<>();
            item.put("status", h.getStatus());
            item.put("changedBy", h.getChangedBy());
            item.put("changedAt", h.getChangedAt());
            hist.add(item);
        }

        return ResponseEntity.ok(new ArrayList<>(grouped.values()));
    }
}
