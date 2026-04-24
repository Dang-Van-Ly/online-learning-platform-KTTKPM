package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.entity.Chapter;
import com.onlinelearning.backend.course.service.ChapterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/chapters")
public class ChapterController {

    private final ChapterService service;

    public ChapterController(ChapterService service) {
        this.service = service;
    }

    // CREATE - Thêm chương mới
    @PostMapping
    public Chapter addChapter(@RequestBody Chapter chapter) {
        return service.create(chapter);
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
    @PutMapping("/{id}")
    public Chapter updateChapter(@PathVariable Long id, @RequestBody Chapter chapter) {
        return service.update(id, chapter);
    }

    // DELETE - Xóa chương
    @DeleteMapping("/{id}")
    public String deleteChapter(@PathVariable Long id) {
        service.delete(id);
        return "Chương học đã được xóa thành công";
    }
}