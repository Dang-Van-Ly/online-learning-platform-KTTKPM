package com.onlinelearning.backend.promotion.controller;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.promotion.entity.Promotion;
import com.onlinelearning.backend.promotion.entity.Promotion_course;
import com.onlinelearning.backend.promotion.repository.Promotion_courseRepository;
import com.onlinelearning.backend.promotion.service.Promotion_courseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    @Autowired
    private Promotion_courseService promotionCourseService;

    @Autowired
    private Promotion_courseRepository promotionCourseRepository;

    // Thêm 1 course vào 1 promotion
    @PostMapping("/{promotionId}/courses/{courseId}")
    public Promotion_course addCourseToPromotion(@PathVariable Long promotionId,
                                                 @PathVariable Long courseId) {
        return promotionCourseService.addCourseToPromotion(promotionId, courseId);
    }

    // Lấy tất cả course của 1 promotion
    @GetMapping("/{promotionId}/courses")
    public List<Course> getCoursesByPromotion(@PathVariable Long promotionId) {
        return promotionCourseRepository.findByPromotionId(promotionId)
                .stream()
                .map(Promotion_course::getCourse)
                .collect(Collectors.toList());
    }

    // Lấy tất cả promotion áp dụng cho 1 course
    @GetMapping("/courses/{courseId}/promotions")
    public List<Promotion> getPromotionsByCourse(@PathVariable Long courseId) {
        return promotionCourseRepository.findByCourseId(courseId)
                .stream()
                .map(Promotion_course::getPromotion)
                .collect(Collectors.toList());
    }
}