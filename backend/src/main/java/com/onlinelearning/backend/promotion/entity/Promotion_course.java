package com.onlinelearning.backend.promotion.entity;

import com.onlinelearning.backend.course.entity.Course;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "promotion_course")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Promotion_course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Sử dụng tính năng tự tăng của DB
    private Long id;

    // Nhiều Promotion_course thuộc 1 Promotion
    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    // Nhiều Promotion_course thuộc 1 Course
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}