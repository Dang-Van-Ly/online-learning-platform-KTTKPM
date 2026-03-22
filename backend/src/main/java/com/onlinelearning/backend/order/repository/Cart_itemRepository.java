package com.onlinelearning.backend.order.repository;

import com.onlinelearning.backend.order.entity.Cart_item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Cart_itemRepository extends JpaRepository<Cart_item, Long> {
    // Query custom nếu cần, ví dụ tìm tất cả cart_items theo cart_id
    // List<Cart_Item> findByCartId(Long cartId);
}