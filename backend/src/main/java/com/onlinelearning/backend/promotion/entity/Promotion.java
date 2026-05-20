package com.onlinelearning.backend.promotion.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "promotion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Promotion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    private String discountType; // "PERCENTAGE" hoặc "FIXED"

    private BigDecimal discountValue;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Integer usageLimit;

    private String status;

    @JsonManagedReference(value = "promotion-course")
    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Promotion_course> promotionCourses;
}