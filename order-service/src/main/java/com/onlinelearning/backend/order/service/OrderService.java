package com.onlinelearning.backend.order.service;

import com.onlinelearning.backend.order.entity.Order;
import com.onlinelearning.backend.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Lấy tất cả đơn hàng (không phân trang - dùng cho các logic cũ nếu có)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Lấy đơn hàng theo id
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // Tạo đơn hàng mới
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    // Xóa đơn hàng
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // Lấy tất cả đơn hàng cho Admin (CÓ PHÂN TRANG)
    public Page<Order> getAllOrdersForAdmin(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    // Duyệt trạng thái đơn hàng bảo mật bằng Transaction
    @Transactional
    public void updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + id));
        order.setStatus(status.toUpperCase());
        orderRepository.save(order);
    }
}