package com.onlinelearning.backend.order.entity;

import com.onlinelearning.backend.course.entity.Course;
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

    // 1 cart_item thuộc về 1 cart
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    // 1 cart_item có thể là 1 course
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // 1 cart_item có thể là 1 membership
    @ManyToOne
    @JoinColumn(name = "membership_id")
    private Membership membership;

    private BigDecimal price;
}