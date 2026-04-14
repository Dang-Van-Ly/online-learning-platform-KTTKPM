package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.entity.Lesson_file;
import com.onlinelearning.backend.course.service.Lesson_fileService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/lesson-files")
public class Lesson_fileController  {

    private final Lesson_fileService service;

    public Lesson_fileController (Lesson_fileService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Lesson_file addFile(@RequestBody Lesson_file file) {
        return service.create(file);
    }

    // READ ALL BY LESSON - Lấy các file của một bài học
    @GetMapping("/lesson/{lessonId}")
    public List<Lesson_file> getFilesByLesson(@PathVariable Long lessonId) {
        return service.getByLessonId(lessonId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteFile(@PathVariable Long id) {
        service.delete(id);
        return "Tài liệu đã được xóa";
    }
}