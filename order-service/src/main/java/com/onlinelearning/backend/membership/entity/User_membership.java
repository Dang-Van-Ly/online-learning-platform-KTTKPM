package com.onlinelearning.backend.membership.entity;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Dùng userId thay vì @ManyToOne User (User ở auth-service)
    @Column(name = "user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "membership_id")
    private Membership membership;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
}
