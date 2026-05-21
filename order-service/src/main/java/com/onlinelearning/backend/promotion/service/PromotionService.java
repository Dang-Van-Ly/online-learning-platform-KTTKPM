package com.onlinelearning.backend.promotion.service;

import com.onlinelearning.backend.promotion.entity.Promotion;
import com.onlinelearning.backend.promotion.repository.PromotionRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    // ================= GET ALL (CACHE) =================
    @Cacheable(value = "promotions")
    public List<Promotion> getAll() {
        return promotionRepository.findAll();
    }

    // ================= SAVE =================
    @CacheEvict(value = "promotions", allEntries = true)
    public Promotion save(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    // ================= CHECK VALID (CACHE BY CODE) =================
    @Cacheable(value = "promotionByCode", key = "#code")
    public Promotion checkValid(String code) {

        Promotion p = promotionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại!"));

        if (!"ACTIVE".equals(p.getStatus())
                || p.getEndDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn hoặc bị khóa!");
        }

        return p;
    }

    // ================= UPDATE/DELETE CACHE CLEAN =================
    @CacheEvict(value = "promotions", allEntries = true)
    public void delete(Long id) {
        promotionRepository.deleteById(id);
    }
}