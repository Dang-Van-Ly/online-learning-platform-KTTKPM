package com.onlinelearning.backend.promotion.service;

import com.onlinelearning.backend.promotion.entity.Promotion;
import com.onlinelearning.backend.promotion.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    // 1. Lấy tất cả danh sách
    public Page<Promotion> getAll(Pageable pageable) {
        return promotionRepository.findAll(pageable);
    }

    // 2. Hàm xóa mã
    public void delete(Long id) {
        promotionRepository.deleteById(id);
    }

    // 3. Hàm cập nhật trạng thái (Tạm dừng / Kích hoạt)
    public void updateStatus(Long id, String newStatus) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã khuyến mãi với ID: " + id));
        promotion.setStatus(newStatus);
        promotionRepository.save(promotion);
    }

    // 4. Hàm lưu mã có lồng logic kiểm tra tối cao (Đã gộp gọn, không bị trùng hàm na)
    public Promotion save(Promotion promotion) {

        // Luôn set mặc định ACTIVE nếu lúc gửi lên chưa có trạng thái
        if (promotion.getStatus() == null) {
            promotion.setStatus("ACTIVE");
        }

        // ĐIỀU KIỆN 1: Kiểm tra ngày áp dụng hợp lệ
        if (promotion.getStartDate() != null) {
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDate startDate = promotion.getStartDate().toLocalDate();

            // 🔑 Ngày bắt đầu phải từ ngày hôm nay trở về sau (không được nằm trong quá khứ)
            if (startDate.isBefore(today)) {
                throw new RuntimeException("Lỗi: Ngày bắt đầu không được ở trong quá khứ (phải từ ngày hôm nay trở đi)!");
            }

            // Kiểm tra tiếp ngày bắt đầu không được sau ngày hết hạn (nếu có nhập ngày hết hạn)
            if (promotion.getEndDate() != null) {
                if (promotion.getStartDate().isAfter(promotion.getEndDate())) {
                    throw new RuntimeException("Lỗi: Ngày bắt đầu không thể sau ngày hết hạn!");
                }
            }
        }

        // ĐIỀU KIỆN 2: Kiểm tra mức giảm giá/số tiền giảm phải lớn hơn 0
        if (promotion.getDiscountValue() == null || promotion.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Lỗi: Mức giảm giá/Số tiền giảm phải lớn hơn 0!");
        }

        // ĐIỀU KIỆN 3: Kiểm tra chi tiết theo từng loại hình giảm giá
        if ("PERCENTAGE".equals(promotion.getDiscountType())) {
            if (promotion.getDiscountValue().compareTo(new BigDecimal("100")) > 0) {
                throw new RuntimeException("Lỗi: Mức giảm giá theo phần trăm không thể lớn hơn 100%!");
            }
            if (promotion.getMaxDiscountAmount() != null && promotion.getMaxDiscountAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Lỗi: Số tiền giảm tối đa phải lớn hơn 0!");
            }
        } else if ("FIXED".equals(promotion.getDiscountType())) {
            if (promotion.getMinOrderValue() != null && promotion.getDiscountValue().compareTo(promotion.getMinOrderValue()) > 0) {
                throw new RuntimeException("Lỗi: Số tiền giảm không được vượt quá giá trị đơn hàng tối thiểu!");
            }
        }

        // ĐIỀU KIỆN 4: Kiểm tra đơn hàng tối thiểu không được âm
        if (promotion.getMinOrderValue() == null || promotion.getMinOrderValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Lỗi: Giá trị đơn hàng tối thiểu không được âm!");
        }

        // Hoàn tất kiểm tra hợp lệ -> Lưu xuống Database
        return promotionRepository.save(promotion);
    }
    // Hàm cập nhật thông tin mã khuyến mãi (Có chạy qua bộ lọc logic save nha Nga)
    public Promotion update(Long id, Promotion details) {
        Promotion existing = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã khuyến mãi với ID: " + id));

        // Đổ dữ liệu mới từ Frontend vào Object cũ
        existing.setCode(details.getCode().toUpperCase());
        existing.setDiscountType(details.getDiscountType());
        existing.setDiscountValue(details.getDiscountValue());
        existing.setMinOrderValue(details.getMinOrderValue());
        existing.setMaxDiscountAmount(details.getMaxDiscountAmount());
        existing.setStartDate(details.getStartDate());
        existing.setEndDate(details.getEndDate());
        // Giữ nguyên trạng thái cũ hoặc cập nhật theo form nếu có
        if (details.getStatus() != null) {
            existing.setStatus(details.getStatus());
        }

        // Gọi lại hàm save(existing) để nó tự động chạy qua 4 tầng logic kiểm tra ngày tháng, mức giảm...
        return this.save(existing);
    }
}