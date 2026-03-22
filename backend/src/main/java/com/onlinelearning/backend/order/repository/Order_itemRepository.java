package com.onlinelearning.backend.order.repository;

import com.onlinelearning.backend.order.entity.Order_item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Order_itemRepository extends JpaRepository<Order_item, Long> {
    // Query custom nếu cần, ví dụ tìm tất cả order_items theo order_id
    // List<Order_Item> findByOrderId(Long orderId);
}