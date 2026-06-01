package com.onlinelearning.backend.order.repository;

import com.onlinelearning.backend.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find all orders belonging to a specific user
    List<Order> findByUserId(Long userId);

    // Paginated retrieval of orders sorted by creation date descending
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Non‑paginated retrieval of orders sorted by creation date descending
    List<Order> findAllByOrderByCreatedAtDesc();
}