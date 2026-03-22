package com.onlinelearning.backend.order.entity;

import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.promotion.entity.Promotion;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1 order thuộc về 1 user
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private BigDecimal totalPrice;

    // 1 order có thể áp dụng 1 promotion
    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    private String status; // ví dụ: PENDING, PAID, CANCELLED
    private String paymentMethod; // ví dụ: COD, BANK_TRANSFER
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Order_item> orderItems;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}