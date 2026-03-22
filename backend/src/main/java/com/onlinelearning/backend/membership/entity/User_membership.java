package com.onlinelearning.backend.membership.entity;

import com.onlinelearning.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_membership")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User_membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Sử dụng tính năng tự tăng của DB
    private Long id;

    // 1 user có thể mua nhiều membership
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 1 membership có thể được nhiều user mua
    @ManyToOne
    @JoinColumn(name = "membership_id")
    private Membership membership;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String status;
}