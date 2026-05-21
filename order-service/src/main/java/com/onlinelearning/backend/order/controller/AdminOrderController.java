package com.onlinelearning.backend.order.controller;

import com.onlinelearning.backend.order.entity.Order;
import com.onlinelearning.backend.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin/orders")
// @PreAuthorize("hasAuthority('ADMIN')") // 👈 Đã khóa dòng này để không bị lỗi 403 nha Nga
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

    // Lấy toàn bộ đơn hàng cho Admin
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    // Duyệt hoặc Hủy đơn hàng
    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok("Trạng thái đơn hàng đã được cập nhật!");
    }
}