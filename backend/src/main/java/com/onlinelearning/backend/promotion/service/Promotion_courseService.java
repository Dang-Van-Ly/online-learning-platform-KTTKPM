package com.onlinelearning.backend.promotion.service;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.repository.CourseRepository;
import com.onlinelearning.backend.promotion.entity.Promotion;
import com.onlinelearning.backend.promotion.entity.Promotion_course;
import com.onlinelearning.backend.promotion.repository.PromotionRepository;
import com.onlinelearning.backend.promotion.repository.Promotion_courseRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Promotion_courseService {

    private final Promotion_courseRepository promotionCourseRepository;
    private final PromotionRepository promotionRepository;
    private final CourseRepository courseRepository;

    public Promotion_courseService(
            Promotion_courseRepository promotionCourseRepository,
            PromotionRepository promotionRepository,
            CourseRepository courseRepository) {
        this.promotionCourseRepository = promotionCourseRepository;
        this.promotionRepository = promotionRepository;
        this.courseRepository = courseRepository;
    }

    // ================= ADD COURSE TO PROMOTION =================
    @CacheEvict(value = {"promotionCourses", "coursesByPromotion", "promotionsByCourse"}, allEntries = true)
    public Promotion_course addCourseToPromotion(Long promotionId, Long courseId) {

        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion không tồn tại!"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course không tồn tại!"));

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

    // ================= GET ALL (CACHE) =================
    @Cacheable(value = "promotionCourses")
    public List<Promotion_course> getAllPromotionCourses() {
        return promotionCourseRepository.findAll();
    }

    // ================= GET BY ID (CACHE) =================
    @Cacheable(value = "promotionCourse", key = "#id")
    public Promotion_course getPromotionCourseById(Long id) {
        return promotionCourseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion_course không tồn tại!"));
    }

    // ================= DELETE =================
    @CacheEvict(value = {"promotionCourses", "promotionCourse", "coursesByPromotion", "promotionsByCourse"}, allEntries = true)
    public void deletePromotionCourse(Long id) {
        Promotion_course pc = promotionCourseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion_course không tồn tại!"));

        promotionCourseRepository.delete(pc);
    }

    // ================= GET COURSES BY PROMOTION (CACHE) =================
    @Cacheable(value = "coursesByPromotion", key = "#promotionId")
    public List<Course> getCoursesByPromotion(Long promotionId) {
        return promotionCourseRepository.findByPromotionId(promotionId)
                .stream()
                .map(Promotion_course::getCourse)
                .toList();
    }

    // ================= GET PROMOTIONS BY COURSE (CACHE) =================
    @Cacheable(value = "promotionsByCourse", key = "#courseId")
    public List<Promotion> getPromotionsByCourse(Long courseId) {
        return promotionCourseRepository.findByCourseId(courseId)
                .stream()
                .map(Promotion_course::getPromotion)
                .toList();
    }
}