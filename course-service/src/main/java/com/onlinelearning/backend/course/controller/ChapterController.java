package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.entity.Chapter;
import com.onlinelearning.backend.course.service.ChapterService;
import com.onlinelearning.backend.course.dto.ChapterPublishRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/chapters")
public class ChapterController {

    private final ChapterService service;

    public ChapterController(ChapterService service) {
        this.service = service;
    }

    // CREATE - Thêm chương mới
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PostMapping
    public Chapter addChapter(@RequestBody Chapter chapter) {
        return service.create(chapter);
    }

    // PUBLISH CHAPTER WITH LESSON AND FILES
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PostMapping("/publish")
    public ResponseEntity<?> publishChapter(@Valid @RequestBody ChapterPublishRequest dto) {
        try {
            Chapter chapter = service.publishChapter(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(chapter);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            e.printStackTrace(); // Log lỗi chi tiết ra console của server để kiểm tra
            Map<String, String> error = new HashMap<>();
            String message = (e.getMessage() != null) ? e.getMessage() : e.toString();
            error.put("error", "Lỗi hệ thống khi xuất bản chương: " + message);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // READ ONE - Lấy thông tin 1 chương theo ID
    @GetMapping("/{id}")
    public Chapter getChapter(@PathVariable Long id) {
        return service.getById(id);
    }

    // READ ALL BY COURSE - Lấy tất cả chương của một khóa học cụ thể
    // Ví dụ: GET /api/chapters/course/C01
    @GetMapping("/course/{courseId}")
    public List<Chapter> getChaptersByCourse(@PathVariable Long courseId) {
        return service.getByCourseId(courseId);
    }

    // UPDATE - Cập nhật thông tin chương
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PutMapping("/{id}")
    public Chapter updateChapter(@PathVariable Long id, @RequestBody Chapter chapter) {
        return service.update(id, chapter);
    }

    // DELETE - Xóa chương
    @PreAuthorize("hasRole('INSTRUCTOR')")
    @DeleteMapping("/{id}")
    public String deleteChapter(@PathVariable Long id) {
        service.delete(id);
        return "Chương học đã được xóa thành công";
    }

    // Global exception handler cho validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}