package com.onlinelearning.backend.promotion.controller;

import com.onlinelearning.backend.promotion.entity.Promotion;
import com.onlinelearning.backend.promotion.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin/promotions")
public class AdminPromotionController {

    @Autowired
    private PromotionService promotionService;

    // 1. Lấy danh sách
    @GetMapping
    public ResponseEntity<Page<Promotion>> getAllPromotions(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(promotionService.getAll(pageable));
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

    // 4. Cập nhật trạng thái (Tạm dừng / Kích hoạt)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePromotionStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            promotionService.updateStatus(id, newStatus);
            return ResponseEntity.ok().body("Cập nhật trạng thái thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi hệ thống: " + e.getMessage());
        }
    } // 👈 Dấu đóng ngoặc chuẩn của hàm số 4 nằm ở đây nha Nga!

    // 5. API Chỉnh sửa thông tin mã khuyến mãi
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePromotion(@PathVariable Long id, @RequestBody Promotion promotionDetails) {
        try {
            Promotion updatedPromotion = promotionService.update(id, promotionDetails);
            return ResponseEntity.ok(updatedPromotion);
        } catch (Exception e) {
            java.util.Map<String, String> errorMap = new java.util.HashMap<>();
            errorMap.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorMap);
        }
    }
}