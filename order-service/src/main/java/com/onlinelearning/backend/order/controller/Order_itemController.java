package com.onlinelearning.backend.order.controller;

import com.onlinelearning.backend.order.entity.Order_item;
import com.onlinelearning.backend.order.service.Order_itemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order-items")
public class Order_itemController {

    @Autowired
    private Order_itemService orderItemService;

    @GetMapping
    public List<Order_item> getAllOrderItems() {
        return orderItemService.getAllOrderItems();
    }

    @GetMapping("/{id}")
    public Optional<Order_item> getOrderItemById(@PathVariable Long id) {
        return orderItemService.getOrderItemById(id);
    }

    @PostMapping
    public Order_item createOrderItem(@RequestBody Order_item orderItem) {
        return orderItemService.createOrderItem(orderItem);
    }

    @PutMapping("/{id}")
    public Order_item updateOrderItem(@PathVariable Long id, @RequestBody Order_item orderItem) {
        orderItem.setId(id);
        return orderItemService.updateOrderItem(orderItem);
    }

    @DeleteMapping("/{id}")
    public void deleteOrderItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
    }
}