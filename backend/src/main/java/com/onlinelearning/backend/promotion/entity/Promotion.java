package com.onlinelearning.backend.promotion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "promotion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Sử dụng tính năng tự tăng của DB
    private Long id;

    @Column(unique = true)
    private String code;

    private String discountType; // "PERCENTAGE" hoặc "FIXED"
    private BigDecimal discountValue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
    private String status;

    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Promotion_course> promotionCourses;
}