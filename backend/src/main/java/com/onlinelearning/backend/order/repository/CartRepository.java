package com.onlinelearning.backend.order.repository;

import com.onlinelearning.backend.order.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    // Có thể thêm các query custom nếu cần, ví dụ tìm cart theo user
    // Optional<Cart> findByUserId(Long userId);
}