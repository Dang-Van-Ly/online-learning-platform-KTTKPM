package com.onlinelearning.backend.order.service;

import com.onlinelearning.backend.order.entity.Cart_item;
import com.onlinelearning.backend.order.repository.Cart_itemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Cart_itemService {

    @Autowired
    private Cart_itemRepository cartItemRepository;

    // Lấy tất cả chi tiết giỏ hàng
    public List<Cart_item> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    // Lấy chi tiết giỏ hàng theo id
    public Optional<Cart_item> getCartItemById(Long id) {
        return cartItemRepository.findById(id);
    }

    // Tạo chi tiết giỏ hàng mới
    public Cart_item createCartItem(Cart_item cartItem) {
        return cartItemRepository.save(cartItem);
    }

    // Cập nhật chi tiết giỏ hàng
    public Cart_item updateCartItem(Cart_item cartItem) {
        return cartItemRepository.save(cartItem);
    }

    // Xóa chi tiết giỏ hàng theo id
    public void deleteCartItem(Long id) {
        cartItemRepository.deleteById(id);
    }
}