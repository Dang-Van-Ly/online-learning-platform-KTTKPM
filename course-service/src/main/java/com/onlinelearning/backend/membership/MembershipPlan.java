package com.onlinelearning.backend.membership;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Read-only mapping tới bảng membership (owned by order-service).
 * Course-service chỉ đọc để kiểm tra giới hạn enrollment.
 */
@Entity
@Table(name = "membership")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MembershipPlan {

    @Id
    private Long id;

    private String name;
    private BigDecimal price;
    private Integer durationDays;
    private Integer coursesPerDay;
    private String status;
}
