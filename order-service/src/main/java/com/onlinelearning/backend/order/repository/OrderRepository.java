package com.onlinelearning.backend.order.repository;

import com.onlinelearning.backend.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
<<<<<<<< HEAD:order-service/src/main/java/com/onlinelearning/backend/order/repository/OrderRepository.java
    // Query custom nếu cần, ví dụ tìm tất cả orders của 1 user
    List<Order> findByUserId(Long userId);

    // Lấy tất cả đơn hàng theo thời gian tạo giảm dần
    List<Order> findAllByOrderByCreatedAtDesc();
========
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
>>>>>>>> origin/nga:backend/src/main/java/com/onlinelearning/backend/order/repository/OrderRepository.java
}