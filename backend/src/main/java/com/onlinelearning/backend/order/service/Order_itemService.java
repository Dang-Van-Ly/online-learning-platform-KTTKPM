package com.onlinelearning.backend.order.service;

import com.onlinelearning.backend.order.entity.Order_item;
import com.onlinelearning.backend.order.repository.Order_itemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Order_itemService {

    @Autowired
    private Order_itemRepository orderItemRepository;

    // Lấy tất cả chi tiết đơn hàng
    public List<Order_item> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    // Lấy chi tiết đơn hàng theo id
    public Optional<Order_item> getOrderItemById(Long id) {
        return orderItemRepository.findById(id);
    }

    // Tạo chi tiết đơn hàng mới
    public Order_item createOrderItem(Order_item orderItem) {
        return orderItemRepository.save(orderItem);
    }

    // Cập nhật chi tiết đơn hàng
    public Order_item updateOrderItem(Order_item orderItem) {
        return orderItemRepository.save(orderItem);
    }

    // Xóa chi tiết đơn hàng theo id
    public void deleteOrderItem(Long id) {
        orderItemRepository.deleteById(id);
    }
}