package com.onlinelearning.backend.order.repository;

import com.onlinelearning.backend.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Query custom nếu cần, ví dụ tìm tất cả orders của 1 user
    // List<Order> findByUserId(Long userId);
}