package com.onlinelearning.backend.promotion.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "promotion_course")
public class Promotion_course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

<<<<<<< HEAD:order-service/src/main/java/com/onlinelearning/backend/promotion/entity/Promotion_course.java
    // courseId thay vì @ManyToOne Course (Course ở course-service)
    @Column(name = "course_id")
    private Long courseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
    @JsonBackReference(value = "promotion-course")
=======
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    // Đã đồng bộ tên value = "promotion-course" để khớp hoàn toàn với bảng Promotion
    @JsonBackReference(value = "promotion-course")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
>>>>>>> origin/nga:backend/src/main/java/com/onlinelearning/backend/promotion/entity/Promotion_course.java
    private Promotion promotion;
}