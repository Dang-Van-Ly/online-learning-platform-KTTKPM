package com.onlinelearning.backend.promotion.repository;

import com.onlinelearning.backend.promotion.entity.Promotion_course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface Promotion_courseRepository extends JpaRepository<Promotion_course, Long> {

    // Lấy danh sách theo promotionId
    List<Promotion_course> findByPromotionId(Long promotionId);

    // Lấy danh sách theo courseId
    List<Promotion_course> findByCourseId(Long courseId);
}