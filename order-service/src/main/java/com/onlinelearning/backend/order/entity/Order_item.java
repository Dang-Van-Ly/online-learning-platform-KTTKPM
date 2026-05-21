package com.onlinelearning.backend.order.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.onlinelearning.backend.membership.entity.Membership;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order_item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
<<<<<<< HEAD:order-service/src/main/java/com/onlinelearning/backend/order/entity/Order_item.java
    @JsonBackReference
=======
    @JsonIgnore
>>>>>>> origin/nga:backend/src/main/java/com/onlinelearning/backend/order/entity/Order_item.java
    private Order order;

    // Dùng courseId thay vì @ManyToOne Course (Course ở course-service)
    @Column(name = "course_id")
    private Long courseId;

    @ManyToOne
    @JoinColumn(name = "membership_id")
    private Membership membership;

    private BigDecimal price;
}
