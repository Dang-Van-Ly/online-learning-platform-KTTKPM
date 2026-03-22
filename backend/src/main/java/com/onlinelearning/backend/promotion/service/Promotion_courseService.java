package com.onlinelearning.backend.promotion.service;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.repository.CourseRepository;
import com.onlinelearning.backend.promotion.entity.Promotion;
import com.onlinelearning.backend.promotion.entity.Promotion_course;
import com.onlinelearning.backend.promotion.repository.PromotionRepository;
import com.onlinelearning.backend.promotion.repository.Promotion_courseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Promotion_courseService {

    @Autowired
    private Promotion_courseRepository promotionCourseRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Thêm course vào promotion
    public Promotion_course addCourseToPromotion(Long promotionId, Long courseId) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion không tồn tại!"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course không tồn tại!"));

        // Kiểm tra xem đã tồn tại chưa
        boolean exists = promotionCourseRepository.findByPromotionId(promotionId)
                .stream()
                .anyMatch(pc -> pc.getCourse().getId().equals(courseId));

        if (exists) {
            throw new RuntimeException("Course này đã được thêm vào Promotion!");
        }

        Promotion_course pc = new Promotion_course();
        pc.setPromotion(promotion);
        pc.setCourse(course);
        return promotionCourseRepository.save(pc);
    }

    // Lấy tất cả Promotion_course
    public List<Promotion_course> getAllPromotionCourses() {
        return promotionCourseRepository.findAll();
    }

    // Lấy Promotion_course theo ID
    public Promotion_course getPromotionCourseById(Long id) {
        return promotionCourseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion_course không tồn tại!"));
    }

    // Xóa Promotion_course theo ID
    public void deletePromotionCourse(Long id) {
        Promotion_course pc = promotionCourseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion_course không tồn tại!"));
        promotionCourseRepository.delete(pc);
    }

    // Lấy tất cả course của 1 promotion
    public List<Course> getCoursesByPromotion(Long promotionId) {
        return promotionCourseRepository.findByPromotionId(promotionId)
                .stream()
                .map(Promotion_course::getCourse)
                .toList();
    }

    // Lấy tất cả promotion áp dụng cho 1 course
    public List<Promotion> getPromotionsByCourse(Long courseId) {
        return promotionCourseRepository.findByCourseId(courseId)
                .stream()
                .map(Promotion_course::getPromotion)
                .toList();
    }
}