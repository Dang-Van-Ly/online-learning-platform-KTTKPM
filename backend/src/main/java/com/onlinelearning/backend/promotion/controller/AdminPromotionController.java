package com.onlinelearning.backend.promotion.controller;

import com.onlinelearning.backend.promotion.entity.Promotion;
import com.onlinelearning.backend.promotion.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin/promotions")
public class AdminPromotionController {

    @Autowired
    private PromotionService promotionService;

    // 1. Lấy danh sách
    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAll());
    }

    // 2. Tạo mới mã
    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        return ResponseEntity.ok(promotionService.save(promotion));
    }

    // 3. Xóa mã
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        promotionService.delete(id);
        return ResponseEntity.ok("Xóa mã khuyến mãi thành công!");
    }
}