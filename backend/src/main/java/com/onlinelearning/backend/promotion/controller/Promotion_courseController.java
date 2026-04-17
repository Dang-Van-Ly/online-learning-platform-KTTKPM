package com.onlinelearning.backend.promotion.controller;

import com.onlinelearning.backend.promotion.entity.Promotion_course;
import com.onlinelearning.backend.promotion.service.Promotion_courseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotion-courses")
public class Promotion_courseController {

    @Autowired
    private Promotion_courseService promotionCourseService;

    // Thêm một Promotion_course mới
    @PostMapping
    public ResponseEntity<Promotion_course> addPromotionCourse(@RequestParam Long promotionId,
                                                               @RequestParam Long courseId) {
        Promotion_course result = promotionCourseService.addCourseToPromotion(promotionId, courseId);
        return ResponseEntity.ok(result);
    }

    // Lấy tất cả Promotion_course
    @GetMapping
    public ResponseEntity<List<Promotion_course>> getAllPromotionCourses() {
        List<Promotion_course> list = promotionCourseService.getAllPromotionCourses();
        return ResponseEntity.ok(list);
    }

    // Lấy Promotion_course theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Promotion_course> getPromotionCourse(@PathVariable Long id) {
        Promotion_course promotionCourse = promotionCourseService.getPromotionCourseById(id);
        return ResponseEntity.ok(promotionCourse);
    }

    // Xóa một Promotion_course theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePromotionCourse(@PathVariable Long id) {
        promotionCourseService.deletePromotionCourse(id);
        return ResponseEntity.ok("Promotion_course đã được xóa thành công");
    }
}