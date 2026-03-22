package com.onlinelearning.backend.membership.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "membership")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Sử dụng tính năng tự tăng của DB
    private Long id;

    private String name;
    private BigDecimal price;
    private Integer durationDays;     // số ngày
    private Integer coursesPerDay;    // số khóa học mỗi ngày
    private String status;

    @OneToMany(mappedBy = "membership", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<User_membership> userMemberships;
}