package com.onlinelearning.backend.promotion.controller;

import com.onlinelearning.backend.promotion.entity.Promotion_course;
import com.onlinelearning.backend.promotion.service.Promotion_courseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotion-courses")
public class Promotion_courseController {

    @Autowired
    private Promotion_courseService promotionCourseService;

    // Thêm một Promotion_course mới (thêm course vào promotion)
    @PostMapping
    public Promotion_course addPromotionCourse(@RequestParam Long promotionId,
                                               @RequestParam Long courseId) {
        return promotionCourseService.addCourseToPromotion(promotionId, courseId);
    }

    // Lấy tất cả Promotion_course
    @GetMapping
    public List<Promotion_course> getAllPromotionCourses() {
        return promotionCourseService.getAllPromotionCourses();
    }

    // Xóa một Promotion_course theo ID
    @DeleteMapping("/{id}")
    public String deletePromotionCourse(@PathVariable Long id) {
        promotionCourseService.deletePromotionCourse(id);
        return "Promotion_course đã được xóa thành công";
    }

    // Lấy Promotion_course theo ID
    @GetMapping("/{id}")
    public Promotion_course getPromotionCourse(@PathVariable Long id) {
        return promotionCourseService.getPromotionCourseById(id);
    }
}