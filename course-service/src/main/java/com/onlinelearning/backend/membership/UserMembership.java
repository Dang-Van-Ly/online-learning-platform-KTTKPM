package com.onlinelearning.backend.membership;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Read-only mapping tới bảng user_membership (owned by order-service).
 * Course-service chỉ đọc để kiểm tra membership còn hạn.
 */
@Entity
@Table(name = "user_membership")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserMembership {

    @Id
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_id")
    private MembershipPlan membership;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
}
