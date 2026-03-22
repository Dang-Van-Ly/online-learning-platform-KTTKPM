package com.onlinelearning.backend.course.controller;

import com.onlinelearning.backend.course.entity.Lesson;
import com.onlinelearning.backend.course.service.LessonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService service;

    public LessonController(LessonService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Lesson addLesson(@RequestBody Lesson lesson) {
        return service.create(lesson);
    }

    // READ ONE
    @GetMapping("/{id}")
    public Lesson getLesson(@PathVariable Long id) {
        return service.getById(id);
    }

    // READ ALL BY CHAPTER - Lấy tất cả bài học của 1 chương
    @GetMapping("/chapter/{chapterId}")
    public List<Lesson> getByChapter(@PathVariable Long chapterId) {
        return service.getByChapterId(chapterId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Lesson updateLesson(@PathVariable Long id, @RequestBody Lesson lesson) {
        return service.update(id, lesson);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteLesson(@PathVariable Long id) {
        service.delete(id);
        return "Bài học đã được xóa thành công";
    }
}