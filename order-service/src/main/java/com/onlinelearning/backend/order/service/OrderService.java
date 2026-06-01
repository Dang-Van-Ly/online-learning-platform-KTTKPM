package com.onlinelearning.backend.order.service;

import com.onlinelearning.backend.order.dto.OrderRequest;
import com.onlinelearning.backend.order.entity.Order;
import com.onlinelearning.backend.order.entity.Order_item;
import com.onlinelearning.backend.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    // Tạo đơn hàng mới từ entity trực tiếp
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    // Tạo đơn hàng mới từ DTO OrderRequest
    @Transactional
    public Order createOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setUserId(orderRequest.getUserId());
        order.setTotalPrice(orderRequest.getTotalPrice());
        order.setStatus(orderRequest.getStatus() != null ? orderRequest.getStatus() : "PENDING");
        order.setPaymentMethod(orderRequest.getPaymentMethod());

        if (orderRequest.getOrderItems() != null) {
            List<Order_item> items = new ArrayList<>();
            for (var itemReq : orderRequest.getOrderItems()) {
                Order_item item = new Order_item();
                item.setCourseId(itemReq.getCourseId());
                item.setPrice(itemReq.getPrice());
                item.setOrder(order);
                items.add(item);
            }
            order.setOrderItems(items);
        }

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

    // Lấy đơn hàng theo userId
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
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