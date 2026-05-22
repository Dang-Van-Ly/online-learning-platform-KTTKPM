package com.onlinelearning.backend.order.service;

import com.onlinelearning.backend.order.dto.OrderItemRequest;
import com.onlinelearning.backend.order.dto.OrderRequest;
import com.onlinelearning.backend.order.entity.Order;
import com.onlinelearning.backend.order.entity.Order_item;
import com.onlinelearning.backend.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Lấy tất cả đơn hàng
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Lấy tất cả đơn hàng cho Admin (theo thời gian tạo giảm dần)
    public List<Order> getAllOrdersForAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    // Lấy đơn hàng theo id
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // Tạo đơn hàng mới
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setTotalPrice(request.getTotalPrice());
        order.setStatus(request.getStatus());
        order.setPaymentMethod(request.getPaymentMethod());

        List<Order_item> items = new ArrayList<>();
        if (request.getOrderItems() != null) {
            for (OrderItemRequest itemRequest : request.getOrderItems()) {
                Order_item orderItem = new Order_item();
                orderItem.setCourseId(itemRequest.getCourseId());
                orderItem.setPrice(itemRequest.getPrice());
                orderItem.setOrder(order);
                items.add(orderItem);
            }
        }
        order.setOrderItems(items);

        return orderRepository.save(order);
    }

    // Cập nhật đơn hàng
    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    // Cập nhật trạng thái đơn hàng (Admin)
    public void updateOrderStatus(Long id, String status) {
        Optional<Order> opt = orderRepository.findById(id);
        if (opt.isPresent()) {
            Order order = opt.get();
            order.setStatus(status);
            orderRepository.save(order);
        }
    }

    // Xóa đơn hàng
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // Lấy đơn hàng theo userId
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}