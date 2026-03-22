package com.onlinelearning.backend.promotion.service;

import com.onlinelearning.backend.promotion.entity.Promotion;
import com.onlinelearning.backend.promotion.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;

    public List<Promotion> getAll() {
        return promotionRepository.findAll();
    }

    public Promotion save(Promotion promotion) {
        return promotionRepository.save(promotion);
    }

    public Promotion checkValid(String code) {
        Promotion p = promotionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại!"));

        if (!"ACTIVE".equals(p.getStatus()) || p.getEndDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn hoặc bị khóa!");
        }
        return p;
    }
}