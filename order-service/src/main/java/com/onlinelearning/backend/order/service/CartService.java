package com.onlinelearning.backend.order.service;

import com.onlinelearning.backend.order.entity.Cart;
import com.onlinelearning.backend.order.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // Lấy tất cả cart
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    // Lấy cart theo id
    public Optional<Cart> getCartById(Long id) {
        return cartRepository.findById(id);
    }

    // Tạo cart mới
    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    // Cập nhật cart
    public Cart updateCart(Cart cart) {
        return cartRepository.save(cart);
    }

    // Xóa cart theo id
    public void deleteCart(Long id) {
        cartRepository.deleteById(id);
    }
}