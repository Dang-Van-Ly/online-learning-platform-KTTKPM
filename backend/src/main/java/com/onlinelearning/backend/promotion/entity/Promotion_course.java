package com.onlinelearning.backend.promotion.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.onlinelearning.backend.course.entity.Course;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    // Đã đồng bộ tên value = "promotion-course" để khớp hoàn toàn với bảng Promotion
    @JsonBackReference(value = "promotion-course")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;
}