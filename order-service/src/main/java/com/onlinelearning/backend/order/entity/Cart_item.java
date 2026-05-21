package com.onlinelearning.backend.order.entity;

import com.onlinelearning.backend.membership.entity.Membership;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart_item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    // Dùng courseId thay vì @ManyToOne Course (Course ở course-service)
    @Column(name = "course_id")
    private Long courseId;

    @ManyToOne
    @JoinColumn(name = "membership_id")
    private Membership membership;

    private BigDecimal price;
}
