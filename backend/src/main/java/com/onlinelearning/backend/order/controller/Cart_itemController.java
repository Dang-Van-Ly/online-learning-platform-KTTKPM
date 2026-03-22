package com.onlinelearning.backend.order.controller;

import com.onlinelearning.backend.order.entity.Cart_item;
import com.onlinelearning.backend.order.service.Cart_itemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart-items")
public class Cart_itemController {

    @Autowired
    private Cart_itemService cartItemService;

    @GetMapping
    public List<Cart_item> getAllCartItems() {
        return cartItemService.getAllCartItems();
    }

    @GetMapping("/{id}")
    public Optional<Cart_item> getCartItemById(@PathVariable Long id) {
        return cartItemService.getCartItemById(id);
    }

    @PostMapping
    public Cart_item createCartItem(@RequestBody Cart_item cartItem) {
        return cartItemService.createCartItem(cartItem);
    }

    @PutMapping("/{id}")
    public Cart_item updateCartItem(@PathVariable Long id, @RequestBody Cart_item cartItem) {
        cartItem.setId(id);
        return cartItemService.updateCartItem(cartItem);
    }

    @DeleteMapping("/{id}")
    public void deleteCartItem(@PathVariable Long id) {
        cartItemService.deleteCartItem(id);
    }
}