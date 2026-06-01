package com.onlinelearning.backend.order.controller;

import com.onlinelearning.backend.order.dto.OrderRequest;
import com.onlinelearning.backend.order.entity.Order;
import com.onlinelearning.backend.order.service.OrderService;
import com.onlinelearning.backend.vnpay.VnpayPaymentResponse;
import com.onlinelearning.backend.vnpay.VnpayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private VnpayService vnpayService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Optional<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping
    public Order createOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.createOrder(orderRequest);
    }

    @PostMapping("/vnpay")
    public VnpayPaymentResponse createVnpayOrder(@RequestBody OrderRequest orderRequest,
                                                 HttpServletRequest request) {
        Order order = orderService.createOrder(orderRequest);
        String clientIp = request.getRemoteAddr();
        String paymentUrl = vnpayService.generatePaymentUrl(order, clientIp);
        return new VnpayPaymentResponse(order.getId(), paymentUrl, order.getStatus());
    }

    @GetMapping("/vnpay/return")
    public String handleVnpayReturn(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, values) -> {
            if (values != null && values.length > 0) {
                params.put(key, values[0]);
            }
        });

        if (!vnpayService.validateReturnSignature(params)) {
            return "INVALID_SIGNATURE";
        }

        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        if (txnRef == null) {
            return "MISSING_TXNREF";
        }

        Long orderId = Long.parseLong(txnRef);
        if ("00".equals(responseCode)) {
            orderService.updateOrderStatus(orderId, "PAID");
            return "PAYMENT_SUCCESS";
        }
        orderService.updateOrderStatus(orderId, "FAILED");
        return "PAYMENT_FAILED";
    }

    @GetMapping("/{id}/confirm")
    public Order confirmOrder(@PathVariable Long id) {
        // mark order as PAID
        orderService.updateOrderStatus(id, "PAID");
        return orderService.getOrderById(id).orElse(null);
    }

    // Public status endpoint for polling (safe to call without auth)
    @GetMapping("/public/{id}")
    public String getOrderStatusPublic(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(o -> o.getStatus())
                .orElse("NOT_FOUND");
    }

    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody Order order) {
        order.setId(id);
        return orderService.updateOrder(order);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Long userId) {
        return orderService.getOrdersByUserId(userId);
    }
}