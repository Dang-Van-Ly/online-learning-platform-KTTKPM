package com.onlinelearning.backend.order.entity;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.membership.entity.Membership;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order_item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1 order_item thuộc về 1 order
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // 1 order_item có thể là 1 course
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // 1 order_item có thể là 1 membership
    @ManyToOne
    @JoinColumn(name = "membership_id")
    private Membership membership;

    private BigDecimal price;
}