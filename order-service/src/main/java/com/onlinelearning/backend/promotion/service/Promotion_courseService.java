package com.onlinelearning.backend.promotion.service;

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

    public Promotion_courseService(
            Promotion_courseRepository promotionCourseRepository,
            PromotionRepository promotionRepository) {
        this.promotionCourseRepository = promotionCourseRepository;
        this.promotionRepository = promotionRepository;
    }

    // ================= ADD COURSE TO PROMOTION =================
    @CacheEvict(value = {"promotionCourses", "coursesByPromotion", "promotionsByCourse"}, allEntries = true)
    public Promotion_course addCourseToPromotion(Long promotionId, Long courseId) {

        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion không tồn tại!"));

        boolean exists = promotionCourseRepository.findByPromotionId(promotionId)
                .stream()
                .anyMatch(pc -> pc.getCourseId().equals(courseId));

        if (exists) {
            throw new RuntimeException("Course này đã được thêm vào Promotion!");
        }

        Promotion_course pc = new Promotion_course();
        pc.setPromotion(promotion);
        pc.setCourseId(courseId);

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

    // ================= GET COURSE IDs BY PROMOTION (CACHE) =================
    @Cacheable(value = "coursesByPromotion", key = "#promotionId")
    public List<Long> getCourseIdsByPromotion(Long promotionId) {
        return promotionCourseRepository.findByPromotionId(promotionId)
                .stream()
                .map(Promotion_course::getCourseId)
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